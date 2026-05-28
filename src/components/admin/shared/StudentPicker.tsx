import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Loader2, Search, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";

export interface PickedStudent {
  id: string;
  student_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  course_name: string | null;
  course_category: string | null;
  course_fees: string | null;
  father_name: string | null;
  mother_name: string | null;
  photo_url: string | null;
  gender: string | null;
  date_of_birth: string | null;
  caste_category: string | null;
  study_center: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  district: string | null;
  pin_code: string | null;
}

interface Props {
  value?: string; // student.student_id text
  onSelect: (student: PickedStudent) => void;
  placeholder?: string;
  className?: string;
  /** When true (default) only active students with the required fields
   * (student_id, full_name, course_name) are listed. Set to false to
   * show every row — useful for debugging. */
  onlyValid?: boolean;
}

const PAGE_SIZE = 25;
const SELECT_COLS =
  "id, student_id, full_name, email, phone, course_name, course_category, course_fees, father_name, mother_name, photo_url, gender, date_of_birth, caste_category, study_center, address, city, state, district, pin_code, status";

/**
 * Searchable Student Picker — server-side search and pagination against
 * student_profiles. The admin types to search across Student ID, name,
 * phone, email, and course; results are fetched in pages of 25 so the
 * picker scales to thousands of students without loading them all.
 */
export default function StudentPicker({ value, onSelect, placeholder, className, onlyValid = true }: Props) {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<PickedStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [showAll, setShowAll] = useState(!onlyValid);
  const [selected, setSelected] = useState<PickedStudent | null>(null);
  const reqIdRef = useRef(0);

  // Debounce the search input (250ms)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  // Build a filtered query against student_profiles.
  const buildQuery = useCallback(
    (q: string, from: number, to: number) => {
      let qb: any = (supabase as any).from("student_profiles").select(SELECT_COLS);
      if (!showAll) {
        qb = qb
          .eq("status", "active")
          .not("student_id", "is", null)
          .not("full_name", "is", null)
          .not("course_name", "is", null);
      }
      if (q) {
        const esc = q.replace(/[%,]/g, " ");
        const pattern = `%${esc}%`;
        qb = qb.or(
          [
            `student_id.ilike.${pattern}`,
            `full_name.ilike.${pattern}`,
            `phone.ilike.${pattern}`,
            `email.ilike.${pattern}`,
            `course_name.ilike.${pattern}`,
          ].join(",")
        );
      }
      return qb.order("created_at", { ascending: false }).range(from, to);
    },
    [showAll]
  );

  // Fetch first page whenever the popover opens, query changes, or filter toggles
  useEffect(() => {
    if (!open) return;
    const myId = ++reqIdRef.current;
    setLoading(true);
    setHasMore(true);
    (async () => {
      const { data, error } = await buildQuery(debounced, 0, PAGE_SIZE - 1);
      if (myId !== reqIdRef.current) return;
      if (error) {
        console.error("StudentPicker load error", error);
        setStudents([]);
        setHasMore(false);
      } else {
        const rows = (data as PickedStudent[]) || [];
        setStudents(rows);
        setHasMore(rows.length === PAGE_SIZE);
      }
      setLoading(false);
    })();
  }, [open, debounced, showAll, buildQuery]);

  // Resolve the currently-selected student by student_id (one-off fetch)
  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    if (selected?.student_id === value) return;
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any)
        .from("student_profiles")
        .select(SELECT_COLS)
        .eq("student_id", value)
        .maybeSingle();
      if (!cancelled && data) setSelected(data as PickedStudent);
    })();
    return () => {
      cancelled = true;
    };
  }, [value, selected?.student_id]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore) return;
    const myId = reqIdRef.current;
    setLoadingMore(true);
    const { data, error } = await buildQuery(debounced, students.length, students.length + PAGE_SIZE - 1);
    if (myId !== reqIdRef.current) return;
    if (!error) {
      const rows = (data as PickedStudent[]) || [];
      setStudents((prev) => [...prev, ...rows]);
      setHasMore(rows.length === PAGE_SIZE);
    }
    setLoadingMore(false);
  }, [buildQuery, debounced, hasMore, loading, loadingMore, students.length]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("h-9 justify-between text-xs font-normal", className)}
        >
          {selected ? (
            <span className="flex items-center gap-2 truncate">
              <UserIcon className="h-3.5 w-3.5 text-primary" />
              <span className="truncate">
                <span className="font-mono text-primary">{selected.student_id}</span>
                <span className="mx-1.5 text-muted-foreground">·</span>
                {selected.full_name}
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              {placeholder || "Search & select a registered student..."}
            </span>
          )}
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0 bg-popover z-50" align="start">
        {/* shouldFilter=false — server already filters */}
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by Student ID, name, phone, or course..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading students..." : "No registered student matches."}
            </CommandEmpty>
            <CommandGroup>
              {students.map((s) => {
                return (
                  <CommandItem
                    key={s.id}
                    value={s.id}
                    onSelect={() => {
                      onSelect(s);
                      setSelected(s);
                      setOpen(false);
                    }}
                    className="flex items-start gap-2 py-2"
                  >
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 mt-1 shrink-0",
                        selected?.id === s.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-primary font-medium">
                          {s.student_id || "—"}
                        </span>
                        <span className="font-medium truncate">{s.full_name}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {s.course_name || "No course"}
                        {s.phone && ` · ${s.phone}`}
                        {s.city && ` · ${s.city}`}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
              {hasMore && !loading && (
                <CommandItem
                  value="__load_more__"
                  onSelect={(e) => {
                    // prevent closing
                    loadMore();
                  }}
                  className="justify-center text-xs text-primary"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading more…
                    </span>
                  ) : (
                    "Load more"
                  )}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
          <div className="flex items-center justify-between border-t px-3 py-2 text-[10px] text-muted-foreground bg-muted/30">
            <span>
              {loading
                ? "Searching…"
                : `Showing ${students.length}${hasMore ? "+" : ""}${debounced ? ` for "${debounced}"` : ""}`}
            </span>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? "Hide incomplete" : "Show all"}
            </button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}