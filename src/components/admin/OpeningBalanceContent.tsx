import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Edit, Trash2, Loader2, TrendingUp, Calendar, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { formatIndianCurrency } from "@/lib/utils";

interface OpeningBalance {
  id: string;
  amount: number;
  entry_date: string;
  description: string;
}

const OpeningBalanceContent = () => {
  const {
    data: openingBalances,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<OpeningBalance>({ 
    tableName: 'opening_balances',
    orderBy: { column: 'entry_date', ascending: false }
  });

  useAdminRealTime({
    tableName: 'opening_balances'
  });

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [editingBalance, setEditingBalance] = useState<OpeningBalance | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async () => {
    if (!amount || !date || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingBalance) {
        // Update existing balance
        await update(editingBalance.id, {
          amount: parseFloat(amount),
          entry_date: date,
          description: description.trim()
        });
        toast.success("Opening balance updated successfully!");
        setEditingBalance(null);
      } else {
        // Create new balance
        const openingBalanceData = {
          amount: parseFloat(amount),
          entry_date: date,
          description: description.trim()
        };
        await create(openingBalanceData);
        toast.success("Opening balance added successfully!");
      }
      
      // Reset form
      setAmount("");
      setDate("");
      setDescription("");
    } catch (error) {
      toast.error(editingBalance ? "Failed to update opening balance" : "Failed to add opening balance");
    }
  };

  const handleReset = () => {
    setAmount("");
    setDate("");
    setDescription("");
    setEditingBalance(null);
  };

  const handleEdit = (balance: OpeningBalance) => {
    setEditingBalance(balance);
    setAmount(balance.amount.toString());
    setDate(balance.entry_date);
    setDescription(balance.description);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this opening balance?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Opening balance deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete opening balance");
    }
  };

  // Filter opening balances based on search and date filters
  const filteredBalances = openingBalances.filter(balance => {
    const matchesSearch = searchTerm === "" || 
      balance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      balance.amount.toString().includes(searchTerm);
    
    const balanceDate = new Date(balance.entry_date);
    const matchesDateRange = (!startDate || balanceDate >= new Date(startDate)) && 
                            (!endDate || balanceDate <= new Date(endDate));
    
    return matchesSearch && matchesDateRange;
  });

  // Calculate statistics
  const totalBalance = filteredBalances.reduce((sum, balance) => sum + balance.amount, 0);
  const totalEntries = filteredBalances.length;
  const avgBalance = totalEntries > 0 ? totalBalance / totalEntries : 0;
  const thisMonthEntries = filteredBalances.filter(balance => {
    const balanceDate = new Date(balance.entry_date);
    const now = new Date();
    return balanceDate.getMonth() === now.getMonth() && balanceDate.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading opening balances...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
              <DollarSign className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Opening Balance Management
              </h1>
              <p className="text-muted-foreground">Manage and track opening balance entries</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Balance</p>
                    <p className="text-2xl font-bold">{formatIndianCurrency(totalBalance)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Entries</p>
                    <p className="text-2xl font-bold">{totalEntries}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Average Balance</p>
                    <p className="text-2xl font-bold">{formatIndianCurrency(avgBalance)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">This Month</p>
                    <p className="text-2xl font-bold">{thisMonthEntries}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <Calendar className="h-6 w-6" />
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
                  <DollarSign className="h-5 w-5 text-primary-foreground" />
                </div>
                <span>{editingBalance ? "Edit Opening Balance" : "Add New Opening Balance"}</span>
              </CardTitle>
            </CardHeader>
          
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-11"
                    placeholder="Enter amount"
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

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] resize-none"
                    rows={5}
                    placeholder="Enter description"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary font-semibold px-8 py-2"
                  >
                    {editingBalance ? "UPDATE" : "SUBMIT"}
                  </Button>
                  {editingBalance && (
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
                <span>Search & Filter Balances</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Search by Description or Amount
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
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
              {(searchTerm || startDate || endDate) && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredBalances.length} of {openingBalances.length} entries | Total: {formatIndianCurrency(totalBalance)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Opening Balances Table */}
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="border-b border-border/10 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="text-xl font-semibold text-foreground">Opening Balance Entries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Actions</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Amount</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Date</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBalances.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="border border-border/20 px-4 py-8 text-center text-muted-foreground">
                          {openingBalances.length === 0 ? "No opening balance entries found" : "No entries match your search criteria"}
                        </td>
                      </tr>
                    ) : (
                      filteredBalances.map((balance, index) => (
                        <tr key={balance.id} className={`hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                          <td className="border border-border/20 px-4 py-3">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(balance)}
                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(balance.id)}
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-foreground font-semibold text-emerald-600">
                            {formatIndianCurrency(balance.amount)}
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-foreground">
                            {new Date(balance.entry_date).toLocaleDateString()}
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-foreground">
                            {balance.description}
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

export default OpeningBalanceContent;