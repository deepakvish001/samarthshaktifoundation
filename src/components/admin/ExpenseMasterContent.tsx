import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Edit, Trash2, Loader2, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface ExpenseMaster {
  id: string;
  service_name: string;
  description?: string;
}

const ExpenseMasterContent = () => {
  const {
    data: expenses,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<ExpenseMaster>({ tableName: 'expense_master' });

  useAdminRealTime({
    tableName: 'expense_master'
  });

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [editingExpense, setEditingExpense] = useState<ExpenseMaster | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState<"all" | "with" | "without">("all");

  const filteredExpenses = useMemo(() => {
    let items = expenses || [];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      items = items.filter(e =>
        e.service_name.toLowerCase().includes(q) ||
        (e.description || "").toLowerCase().includes(q)
      );
    }

    if (filterOption === "with") {
      items = items.filter(e => (e.description || "").trim().length > 0);
    } else if (filterOption === "without") {
      items = items.filter(e => !e.description || e.description.trim().length === 0);
    }

    return items;
  }, [expenses, searchTerm, filterOption]);

  const handleSubmit = async () => {
    if (!serviceName.trim()) {
      toast.error("Please enter a service name");
      return;
    }

    try {
      if (editingExpense) {
        // Update existing expense
        await update(editingExpense.id, {
          service_name: serviceName.trim(),
          description: description || null
        });
        toast.success("Expense service updated successfully!");
        setEditingExpense(null);
      } else {
        // Create new expense
        await create({
          service_name: serviceName.trim(),
          description: description || null
        });
        toast.success("Expense service added successfully!");
      }
      
      setServiceName("");
      setDescription("");
    } catch (error) {
      toast.error(editingExpense ? "Failed to update expense service" : "Failed to add expense service");
    }
  };

  const handleReset = () => {
    setServiceName("");
    setDescription("");
    setEditingExpense(null);
  };

  const handleEdit = (expense: ExpenseMaster) => {
    setEditingExpense(expense);
    setServiceName(expense.service_name);
    setDescription(expense.description || "");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Expense service deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete expense service");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
            <CardContent className="p-12 flex items-center justify-center min-h-[600px]">
              <div className="flex flex-col items-center space-y-6">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground text-lg font-medium">Loading expense data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Receipt className="h-8 w-8 text-primary" />
            </div>
            <span>Expense Master Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Services</p>
                  <p className="text-3xl font-bold">{expenses.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Receipt className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">With Description</p>
                  <p className="text-3xl font-bold">{expenses.filter(e => e.description).length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Edit className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Without Description</p>
                  <p className="text-3xl font-bold">{expenses.filter(e => !e.description).length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Trash2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Filtered Results</p>
                  <p className="text-3xl font-bold text-foreground">{filteredExpenses.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Filter className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Receipt className="h-6 w-6" />
              </div>
              <span>{editingExpense ? 'Edit Expense Service' : 'Add New Expense Service'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Service Name*</label>
                <Input
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter service name"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 resize-none"
                  placeholder="Enter description (optional)"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-border/20">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
              >
                {editingExpense ? 'Update Service' : 'Add Service'}
              </Button>
              
              {editingExpense && (
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="border-border/40 hover:bg-accent/20 px-8"
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by service name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={filterOption} onValueChange={(val) => setFilterOption(val as any)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by description" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All</SelectItem>
                    <SelectItem value="with" className="hover:bg-accent/50">With Description</SelectItem>
                    <SelectItem value="without" className="hover:bg-accent/50">Without Description</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Receipt className="h-6 w-6" />
                </div>
                <span>Expense Services ({filteredExpenses.length})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {expenses.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="border border-border/40 rounded-lg bg-background/50 overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground">
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <Edit className="h-4 w-4" />
                          Actions
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4" />
                          Service Name
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[300px]">
                        <div className="flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Description
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense, index) => (
                      <tr key={expense.id} className={`${index % 2 === 0 ? "bg-background/80" : "bg-accent/5"} hover:bg-accent/20 transition-colors duration-200 border-b border-border/30`}>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(expense)}
                              className="text-primary hover:text-primary hover:bg-primary/10 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Edit Service"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(expense.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                              title="Delete Service"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="font-semibold text-foreground">{expense.service_name}</div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {expense.description || "No description provided"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseMasterContent;