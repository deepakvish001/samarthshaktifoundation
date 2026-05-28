import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface LookupRow {
  id: string;
  name: string;
  code?: string | null;
  is_active: boolean;
  sort_order?: number | null;
  created_at?: string;
}

interface Props {
  tableName: string;
  title: string;
  description?: string;
  withCode?: boolean; // show "code" column (used by study_centers)
}

/**
 * Generic admin CRUD for simple lookup tables (study_centers, titles,
 * genders, caste_categories, qualifications). Each row has a name, an
 * active flag, and an optional sort_order / code.
 */
export default function LookupMasterContent({ tableName, title, description, withCode }: Props) {
  const { data, loading, create, update, delete: del } = useOptimisticCrud<LookupRow>({
    tableName,
    orderBy: { column: "sort_order", ascending: true },
  });
  useAdminRealTime({ tableName });

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await create({
        name: name.trim(),
        ...(withCode ? { code: code.trim() || null } : {}),
        is_active: true,
        sort_order: data.length + 1,
      } as any);
      setName("");
      setCode("");
      toast.success(`Added "${name}"`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to add");
    }
  };

  const startEdit = (row: LookupRow) => {
    setEditingId(row.id);
    setEditName(row.name);
    setEditCode(row.code || "");
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await update(id, {
        name: editName.trim(),
        ...(withCode ? { code: editCode.trim() || null } : {}),
      } as any);
      setEditingId(null);
      toast.success("Updated");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update");
    }
  };

  const toggleActive = async (row: LookupRow) => {
    try {
      await update(row.id, { is_active: !row.is_active } as any);
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  };

  const handleDelete = async (row: LookupRow) => {
    if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    try {
      await del(row.id);
      toast.success("Deleted");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {data.length} total
            </span>
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-end mb-6">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`New ${title.toLowerCase()} entry...`}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            {withCode && (
              <div className="w-32">
                <label className="text-xs font-medium text-muted-foreground">Code</label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            )}
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Name</TableHead>
                  {withCode && <TableHead>Code</TableHead>}
                  <TableHead className="w-32">Active</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={withCode ? 5 : 4} className="text-center py-8 text-muted-foreground">
                      No entries yet. Add one above to populate the dropdown.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, i) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        {editingId === row.id ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          <span className="font-medium">{row.name}</span>
                        )}
                      </TableCell>
                      {withCode && (
                        <TableCell>
                          {editingId === row.id ? (
                            <Input
                              value={editCode}
                              onChange={(e) => setEditCode(e.target.value)}
                              className="h-8 w-24"
                            />
                          ) : (
                            <span className="text-muted-foreground">{row.code || "—"}</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <Switch
                          checked={row.is_active}
                          onCheckedChange={() => toggleActive(row)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === row.id ? (
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => saveEdit(row.id)}>
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => startEdit(row)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(row)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}