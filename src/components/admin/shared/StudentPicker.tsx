import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search, User as UserIcon } from "lucide-react";
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

/**
 * Searchable Student Picker — reads student_profiles and lets the admin
 * pick a registered student by Student ID, name, or phone. The selected
 * student is passed back so the parent form can auto-fill ID, name,
 * course, photo, etc.
 */
export default function StudentPicker({ value, onSelect, placeholder, className, onlyValid = true }: Props) {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<PickedStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(!onlyValid);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from("student_profiles")
        .select(
          "id, student_id, full_name, email, phone, course_name, course_category, course_fees, father_name, mother_name, photo_url, gender, date_of_birth, caste_category, study_center, address, city, state, district, pin_code, status"
        )
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("StudentPicker load error", error);
        setStudents([]);
      } else {
        setStudents((data as PickedStudent[]) || []);
      }
      setLoading(false);
    };
    load();
    // Refresh on realtime changes
    const ch = supabase
      .channel("student-picker-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_profiles" },
        () => load()
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, []);

  const selected = useMemo(
    () => students.find((s) => s.student_id === value),
    [students, value]
  );

  const visibleStudents = useMemo(() => {
    if (showAll) return students;
    return students.filter((s: any) =>
      (!s.status || s.status === "active") &&
      !!s.student_id &&
      !!s.full_name &&
      !!s.course_name
    );
  }, [students, showAll]);

  const hiddenCount = students.length - visibleStudents.length;

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
        <Command>
          <CommandInput placeholder="Search by Student ID, name, phone, or course..." />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading students..." : "No registered student matches."}
            </CommandEmpty>
            <CommandGroup>
              {visibleStudents.map((s) => {
                const haystack = [
                  s.student_id,
                  s.full_name,
                  s.phone,
                  s.email,
                  s.course_name,
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <CommandItem
                    key={s.id}
                    value={haystack}
                    onSelect={() => {
                      onSelect(s);
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
            </CommandGroup>
          </CommandList>
          {hiddenCount > 0 && (
            <div className="flex items-center justify-between border-t px-3 py-2 text-[10px] text-muted-foreground bg-muted/30">
              <span>{hiddenCount} incomplete/inactive hidden</span>
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? "Hide incomplete" : "Show all"}
              </button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}