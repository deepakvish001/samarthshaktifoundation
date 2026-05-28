import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Search, Edit, Trash2, Loader2, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface DayBookEntry {
  id: string;
  service_name: string;
  amount: number;
  entry_date: string;
  description?: string;
  transaction_type: string;
}

const DayBookContent = () => {
  const {
    data: dayBookEntries,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<DayBookEntry>({ 
    tableName: 'day_book_entries',
    orderBy: { column: 'entry_date', ascending: false }
  });

  useAdminRealTime({
    tableName: 'day_book_entries'
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [serviceName, setServiceName] = useState("all");
  const [filteredEntries, setFilteredEntries] = useState<DayBookEntry[]>([]);

  // Filter entries based on search criteria
  useEffect(() => {
    let filtered = dayBookEntries;

    if (serviceName && serviceName !== "all") {
      filtered = filtered.filter(entry => 
        entry.service_name.toLowerCase().includes(serviceName.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.entry_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return entryDate >= start && entryDate <= end;
      });
    }

    setFilteredEntries(filtered);
  }, [dayBookEntries, serviceName, startDate, endDate]);

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    // The filtering is already done in useEffect
    toast.success(`Found ${filteredEntries.length} entries`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Day book entry deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  const totalAmount = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalEntries = filteredEntries.length;
  const avgAmount = totalEntries > 0 ? totalAmount / totalEntries : 0;
  const todayEntries = filteredEntries.filter(entry => {
    const today = new Date().toDateString();
    const entryDate = new Date(entry.entry_date).toDateString();
    return today === entryDate;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading day book entries...</p>
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
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Day Book Management
              </h1>
              <p className="text-muted-foreground">Track daily financial transactions and entries</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Amount</p>
                    <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
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
                    <BookOpen className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Average Amount</p>
                    <p className="text-2xl font-bold">₹{avgAmount.toFixed(2)}</p>
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
                    <p className="text-orange-100 text-sm font-medium">Today's Entries</p>
                    <p className="text-2xl font-bold">{todayEntries}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="border-0 shadow-xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 mb-8">
          <CardHeader className="border-b border-border/10 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
                <Search className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>Search & Filter Entries</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Start Date */}
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

              {/* End Date */}
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

              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Service Name
                </label>
                <Select value={serviceName} onValueChange={setServiceName}>
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

              {/* Search Button */}
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary font-semibold px-8 py-2 h-11 w-full"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            {(startDate || endDate || serviceName !== "all") && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredEntries.length} entries | Total: ₹{totalAmount.toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Day Book Entries Table */}
        <Card className="border-0 shadow-xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardHeader className="border-b border-border/10 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="text-xl font-semibold text-foreground">Day Book Entries</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Actions</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Service Name</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Amount</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Date</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Type</th>
                      <th className="border border-border/20 px-4 py-3 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry, index) => (
                      <tr key={entry.id} className={`hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                        <td className="border border-border/20 px-4 py-3">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Could implement edit functionality here
                                toast.info("Edit functionality can be added if needed");
                              }}
                              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(entry.id)}
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border border-border/20 px-4 py-3 text-foreground font-medium">
                          {entry.service_name}
                        </td>
                        <td className="border border-border/20 px-4 py-3 text-foreground font-semibold text-emerald-600">
                          ₹{entry.amount.toFixed(2)}
                        </td>
                        <td className="border border-border/20 px-4 py-3 text-foreground">
                          {new Date(entry.entry_date).toLocaleDateString()}
                        </td>
                        <td className="border border-border/20 px-4 py-3 text-foreground">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.transaction_type === 'credit' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.transaction_type}
                          </span>
                        </td>
                        <td className="border border-border/20 px-4 py-3 text-muted-foreground">
                          {entry.description || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No Entries Found</h3>
                <p>No day book entries match your search criteria. Try adjusting your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DayBookContent;