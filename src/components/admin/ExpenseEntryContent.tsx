import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Edit, Trash2, Loader2, TrendingUp, Users, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface ExpenseEntry {
  id: string;
  service_name: string;
  expense_name: string;
  quantity: string;
  given_to: string;
  description?: string;
  expense_date: string;
}

const ExpenseEntryContent = () => {
  const {
    data: expenseEntries,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<ExpenseEntry>({ tableName: 'expense_entries' });

  useAdminRealTime({
    tableName: 'expense_entries'
  });

  const [serviceName, setServiceName] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [givenTo, setGivenTo] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [editingExpense, setEditingExpense] = useState<ExpenseEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("all");

  const handleEdit = (expense: ExpenseEntry) => {
    setEditingExpense(expense);
    setServiceName(expense.service_name);
    setExpenseName(expense.expense_name);
    setQuantity(expense.quantity);
    setGivenTo(expense.given_to);
    setDescription(expense.description || "");
    setDate(expense.expense_date);
  };

  const handleUpdate = async () => {
    if (!editingExpense) return;
    
    if (!serviceName || !expenseName || !quantity || !givenTo || !date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await update(editingExpense.id, {
        service_name: serviceName,
        expense_name: expenseName,
        quantity: quantity,
        given_to: givenTo,
        description: description || null,
        expense_date: date
      });

      setEditingExpense(null);
      handleReset();
      toast.success("Expense entry updated successfully!");
    } catch (error) {
      toast.error("Failed to update expense entry");
    }
  };

  const handleSubmit = async () => {
    if (editingExpense) {
      await handleUpdate();
      return;
    }

    if (!serviceName || !expenseName || !quantity || !givenTo || !date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await create({
        service_name: serviceName,
        expense_name: expenseName,
        quantity: quantity,
        given_to: givenTo,
        description: description || null,
        expense_date: date
      });

      handleReset();
      toast.success("Expense entry added successfully!");
    } catch (error) {
      toast.error("Failed to add expense entry");
    }
  };

  const handleReset = () => {
    setServiceName("");
    setExpenseName("");
    setQuantity("");
    setGivenTo("");
    setDescription("");
    setDate("");
    setEditingExpense(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense entry?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Expense entry deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete expense entry");
    }
  };

  // Filter expenses based on search and service filter
  const filteredExpenses = expenseEntries.filter(expense => {
    const matchesSearch = searchTerm === "" || 
      expense.expense_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.given_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.description && expense.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesService = selectedService === "all" || expense.service_name === selectedService;
    
    return matchesSearch && matchesService;
  });

  // Calculate statistics
  const totalExpenses = expenseEntries.length;
  const uniqueServices = new Set(expenseEntries.map(e => e.service_name)).size;
  const thisMonthExpenses = expenseEntries.filter(e => {
    const expenseDate = new Date(e.expense_date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading expense entries...</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
              <Receipt className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Expense Entry Management
              </h1>
              <p className="text-muted-foreground">Record and manage expense entries efficiently</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Expenses</p>
                    <p className="text-3xl font-bold">{totalExpenses}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Service Types</p>
                    <p className="text-3xl font-bold">{uniqueServices}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">This Month</p>
                    <p className="text-3xl font-bold">{thisMonthExpenses}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          {/* Form Card */}
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="border-b border-border/10 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
                  <Receipt className="h-5 w-5 text-primary-foreground" />
                </div>
                <span>{editingExpense ? "Edit Expense Entry" : "Add New Expense Entry"}</span>
              </CardTitle>
            </CardHeader>
        
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Service Name *
                  </label>
                  <Select value={serviceName} onValueChange={setServiceName}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="tea">Tea</SelectItem>
                      <SelectItem value="office-supplies">Office Supplies</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Expense Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Expense Name *
                    </label>
                    <Input
                      type="text"
                      value={expenseName}
                      onChange={(e) => setExpenseName(e.target.value)}
                      className="h-11"
                      placeholder="Enter expense name"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quantity *
                    </label>
                    <Input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-11"
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Given To */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Given To *
                    </label>
                    <Input
                      type="text"
                      value={givenTo}
                      onChange={(e) => setGivenTo(e.target.value)}
                      className="h-11"
                      placeholder="Enter recipient"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date *
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] resize-none"
                    rows={4}
                    placeholder="Enter description"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary font-semibold px-8 py-2"
                  >
                    {editingExpense ? "UPDATE" : "SUBMIT"}
                  </Button>
                  {editingExpense && (
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      className="px-6 py-2"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="font-semibold px-8 py-2"
                  >
                    RESET
                  </Button>
                </div>
              </div>
            </CardContent>
      </Card>

          {/* Search and Filter */}
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="border-b border-border/10 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
                  <Search className="h-5 w-5 text-primary-foreground" />
                </div>
                <span>Search & Filter Expenses</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Search by Name, Recipient, or Description
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter search term..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Filter by Service
                  </label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="All services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="tea">Tea</SelectItem>
                      <SelectItem value="office-supplies">Office Supplies</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(searchTerm || selectedService !== "all") && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredExpenses.length} of {totalExpenses} expenses
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="border-b border-border/10 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="text-xl font-semibold text-foreground">Expense Entries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Actions</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Service Name</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Expense Name</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Quantity</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Given To</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Description</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="border border-border/20 px-4 py-8 text-center text-muted-foreground">
                          {expenseEntries.length === 0 ? "No expense entries found" : "No entries match your search criteria"}
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map((expense, index) => (
                        <tr key={expense.id} className={`hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                          <td className="border border-border/20 px-4 py-3">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(expense)}
                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(expense.id)}
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-foreground font-medium">
                            {expense.service_name}
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-foreground">
                            {expense.expense_name}
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-foreground">
                            {expense.quantity}
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-foreground">
                            {expense.given_to}
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-muted-foreground">
                            {expense.description || "N/A"}
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-foreground">
                            {new Date(expense.expense_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseEntryContent;