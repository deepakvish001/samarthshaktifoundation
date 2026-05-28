import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileBarChart, Edit, Trash2, DollarSign, Receipt, Calendar, Users, TrendingUp, Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface FeesRecord {
  id: number;
  receipt: string;
  date: string;
  student: string;
  feefor: string;
  totalfee: string;
  feepaid: string;
  freedue: string;
  other: string;
  frmid: string;
  frmname: string;
}

const FeesReportContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [feesData] = useState<FeesRecord[]>([
    {
      id: 17,
      receipt: "ReceiptNo 14",
      date: "2019-06-06",
      student: "--Select Student Name--",
      feefor: "450",
      totalfee: "600",
      feepaid: "200",
      freedue: "400",
      other: "Diploma in Computer Application",
      frmid: "SM11101",
      frmname: "Ravi Kumar Gupta"
    },
    {
      id: 18,
      receipt: "ReceiptNo 1",
      date: "2019-10-08",
      student: "vivek",
      feefor: "TE111031",
      totalfee: "500000",
      feepaid: "24000",
      freedue: "476000",
      other: "BTech",
      frmid: "FRN111052",
      frmname: "Pushpatechnosoft"
    },
    {
      id: 19,
      receipt: "ReceiptNo 2",
      date: "2019-10-05",
      student: "vivek",
      feefor: "TE111032",
      totalfee: "500000",
      feepaid: "35000",
      freedue: "465000",
      other: "BTech",
      frmid: "FRN111052",
      frmname: "Pushpatechnosoft"
    },
    {
      id: 20,
      receipt: "ReceiptNo 4",
      date: "09/01/2021",
      student: "--Select Student Name--",
      feefor: "001",
      totalfee: "4000",
      feepaid: "200",
      freedue: "3800",
      other: "ADCA",
      frmid: "SM11101",
      frmname: "SM11101"
    },
    {
      id: 21,
      receipt: "ReceiptNo 5",
      date: "30/12/2020",
      student: "Mr./₹TBINASOFT",
      feefor: "20016",
      totalfee: "4800",
      feepaid: "2000",
      freedue: "2800",
      other: "ADCA",
      frmid: "SM11101",
      frmname: "SM11101"
    }
  ]);

  // Filter and search functionality
  const filteredData = useMemo(() => {
    let filtered = feesData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.receipt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.frmname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply course filter
    if (filterCourse !== "all") {
      filtered = filtered.filter(item => item.other === filterCourse);
    }

    // Apply status filter (based on due amount)
    if (filterStatus !== "all") {
      if (filterStatus === "paid") {
        filtered = filtered.filter(item => parseFloat(item.freedue) === 0);
      } else if (filterStatus === "pending") {
        filtered = filtered.filter(item => parseFloat(item.freedue) > 0);
      }
    }

    return filtered;
  }, [feesData, searchTerm, filterCourse, filterStatus]);

  // Helper function to format large numbers
  const formatAmount = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`; // Lakh format
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`; // Thousand format
    }
    return `₹${amount.toLocaleString()}`;
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = filteredData.length;
    const totalAmount = filteredData.reduce((sum, fee) => sum + parseFloat(fee.totalfee), 0);
    const paidAmount = filteredData.reduce((sum, fee) => sum + parseFloat(fee.feepaid), 0);
    const dueAmount = filteredData.reduce((sum, fee) => sum + parseFloat(fee.freedue), 0);
    const collectionRate = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
    
    return { total, totalAmount, paidAmount, dueAmount, collectionRate };
  }, [filteredData]);

  const handleEdit = (fee: FeesRecord) => {
    toast.info(`Edit functionality for Receipt ${fee.receipt}`);
  };

  const handleDelete = (fee: FeesRecord) => {
    if (!confirm(`Are you sure you want to delete Receipt ${fee.receipt}?`)) return;
    toast.success(`Receipt ${fee.receipt} deleted successfully!`);
  };

  const handleSearch = () => {
    toast.success(`Found ${filteredData.length} fees records`);
  };

  const courses = [...new Set(feesData.map(fee => fee.other))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileBarChart className="h-8 w-8 text-primary" />
            </div>
            <span>Fees Reports Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Records</p>
                  <p className="text-3xl font-bold break-words">{statistics.total}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full flex-shrink-0">
                  <Receipt className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-accent-foreground/80 text-sm font-medium">Total Amount</p>
                  <p className="text-3xl font-bold" title={`₹${statistics.totalAmount.toLocaleString()}`}>{formatAmount(statistics.totalAmount)}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full flex-shrink-0">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-secondary-foreground/80 text-sm font-medium">Amount Paid</p>
                  <p className="text-3xl font-bold" title={`₹${statistics.paidAmount.toLocaleString()}`}>{formatAmount(statistics.paidAmount)}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full flex-shrink-0">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-3">
                  <p className="text-muted-foreground/80 text-sm font-medium">Collection Rate</p>
                  <p className="text-3xl font-bold text-foreground break-words">{statistics.collectionRate}%</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Filter className="h-6 w-6" />
              </div>
              <span>Search & Filter Fees Reports</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by student, receipt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course</label>
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course} className="hover:bg-accent/50">
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Payment Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Status</SelectItem>
                    <SelectItem value="paid" className="hover:bg-accent/50">Fully Paid</SelectItem>
                    <SelectItem value="pending" className="hover:bg-accent/50">Payment Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Action</label>
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                >
                  Search Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fees Reports Table */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Receipt className="h-6 w-6" />
                </div>
                <span>Fees Reports ({filteredData.length} records)</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Due: ₹{statistics.dueAmount.toLocaleString()}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Receipt className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
                <p className="text-gray-500">No fees records match the selected criteria. Try adjusting your filters.</p>
              </div>
            ) : (
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
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[80px]">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4" />
                            ID
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4" />
                            Receipt
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Student
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-right min-w-[100px]">
                          <div className="flex items-center justify-end gap-2">
                            <DollarSign className="h-4 w-4" />
                            Total Fee
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-right min-w-[100px]">
                          <div className="flex items-center justify-end gap-2">
                            <DollarSign className="h-4 w-4" />
                            Fee Paid
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-right min-w-[100px]">
                          <div className="flex items-center justify-end gap-2">
                            <DollarSign className="h-4 w-4" />
                            Fee Due
                          </div>
                        </th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <FileBarChart className="h-4 w-4" />
                            Course
                          </div>
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Franchise
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((fee, index) => (
                        <tr 
                          key={fee.id}
                          className={`border-b border-border/20 hover:bg-accent/10 transition-colors ${
                            index % 2 === 0 ? 'bg-background/30' : 'bg-background/50'
                          }`}
                        >
                          <td className="border-r border-border/20 px-6 py-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <Button
                                onClick={() => handleEdit(fee)}
                                size="sm"
                                variant="ghost"
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(fee)}
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="font-mono text-sm text-muted-foreground">{fee.id}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="font-medium text-foreground">{fee.receipt}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="text-foreground">{fee.date}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="font-medium text-foreground">{fee.student}</div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-right">
                            <div className="font-bold text-blue-600">
                              ₹{parseFloat(fee.totalfee).toLocaleString()}
                            </div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-right">
                            <div className="font-bold text-green-600">
                              ₹{parseFloat(fee.feepaid).toLocaleString()}
                            </div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-right">
                            <div className={`font-bold ${parseFloat(fee.freedue) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              ₹{parseFloat(fee.freedue).toLocaleString()}
                            </div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="text-foreground">{fee.other}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-foreground">
                              <div className="font-medium">{fee.frmname}</div>
                              <div className="text-sm text-muted-foreground">{fee.frmid}</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span>Financial Summary</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-xl lg:text-3xl font-bold text-blue-700 mb-2 break-words">₹{statistics.totalAmount.toLocaleString()}</div>
                <div className="text-xs lg:text-sm font-medium text-blue-600">Total Amount</div>
              </div>
              <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="text-xl lg:text-3xl font-bold text-green-700 mb-2 break-words">₹{statistics.paidAmount.toLocaleString()}</div>
                <div className="text-xs lg:text-sm font-medium text-green-600">Amount Collected</div>
              </div>
              <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                <div className="text-xl lg:text-3xl font-bold text-red-700 mb-2 break-words">₹{statistics.dueAmount.toLocaleString()}</div>
                <div className="text-xs lg:text-sm font-medium text-red-600">Amount Due</div>
              </div>
              <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-xl lg:text-3xl font-bold text-purple-700 mb-2">{statistics.collectionRate}%</div>
                <div className="text-xs lg:text-sm font-medium text-purple-600">Collection Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeesReportContent;