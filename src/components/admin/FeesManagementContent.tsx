import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, Edit, Trash2, Loader2, DollarSign, FileText, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import StudentPicker from "@/components/admin/shared/StudentPicker";
import { validateStudentSelection } from "@/components/admin/shared/validateStudentSelection";

interface FeesReceipt {
  id: string;
  receipt_no: string;
  franchise_name: string;
  franchise_id: string;
  receipt_date: string;
  course: string;
  student: string;
  student_id: string;
  total_fee: number;
  amount_paid: number;
  payment_details?: string;
  amount_due: number;
  status: string;
}

const FeesManagementContent = () => {
  // Sample data for demonstration
  const sampleData: FeesReceipt[] = [
    {
      id: "1",
      receipt_no: "REC001",
      franchise_name: "Franchise 001",
      franchise_id: "FR001",
      receipt_date: "2024-01-15",
      course: "Basic Computer Course",
      student: "John Doe",
      student_id: "STU001",
      total_fee: 25000,
      amount_paid: 15000,
      payment_details: "Online Transfer",
      amount_due: 10000,
      status: "Partial"
    },
    {
      id: "2",
      receipt_no: "REC002",
      franchise_name: "Franchise 002",
      franchise_id: "FR002",
      receipt_date: "2024-01-16",
      course: "Advanced Computer Course",
      student: "Jane Smith",
      student_id: "STU002",
      total_fee: 35000,
      amount_paid: 35000,
      payment_details: "Cash Payment",
      amount_due: 0,
      status: "Paided"
    },
    {
      id: "3",
      receipt_no: "REC003",
      franchise_name: "Franchise 001",
      franchise_id: "FR001",
      receipt_date: "2024-01-17",
      course: "Programming Fundamentals",
      student: "Mike Johnson",
      student_id: "STU003",
      total_fee: 45000,
      amount_paid: 0,
      payment_details: "Pending",
      amount_due: 45000,
      status: "Pending"
    },
    {
      id: "4",
      receipt_no: "REC004",
      franchise_name: "Franchise 003",
      franchise_id: "FR003",
      receipt_date: "2024-01-18",
      course: "Basic Computer Course",
      student: "Sarah Wilson",
      student_id: "STU004",
      total_fee: 25000,
      amount_paid: 25000,
      payment_details: "UPI Payment",
      amount_due: 0,
      status: "Paided"
    },
    {
      id: "5",
      receipt_no: "REC005",
      franchise_name: "Franchise 002",
      franchise_id: "FR002",
      receipt_date: "2024-01-19",
      course: "Advanced Computer Course",
      student: "David Brown",
      student_id: "STU005",
      total_fee: 35000,
      amount_paid: 20000,
      payment_details: "Bank Transfer",
      amount_due: 15000,
      status: "Partial"
    }
  ];

  const {
    data: feesReceipts = sampleData,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<FeesReceipt>({ 
    tableName: 'fees_receipts',
    orderBy: { column: 'created_at', ascending: false }
  });

  useAdminRealTime({
    tableName: 'fees_receipts'
  });

  const [receiptNo, setReceiptNo] = useState(`REC${String((sampleData.length || 0) + 1).padStart(3, '0')}`);
  const [franchiseName, setFranchiseName] = useState("");
  const [franchiseId, setFranchiseId] = useState("");
  const [date, setDate] = useState("");
  const [course, setCourse] = useState("");
  const [student, setStudent] = useState("");
  const [studentId, setStudentId] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [status, setStatus] = useState("Pending");

  const [editingReceipt, setEditingReceipt] = useState<FeesReceipt | null>(null);

  const handleEdit = (receipt: FeesReceipt) => {
    setEditingReceipt(receipt);
    setReceiptNo(receipt.receipt_no);
    setFranchiseName(receipt.franchise_name);
    setFranchiseId(receipt.franchise_id);
    setDate(receipt.receipt_date);
    setCourse(receipt.course);
    setStudent(receipt.student);
    setStudentId(receipt.student_id);
    setTotalFee(receipt.total_fee.toString());
    setAmountPaid(receipt.amount_paid.toString());
    setPaymentDetails(receipt.payment_details || "");
    setAmountDue(receipt.amount_due.toString());
    setStatus(receipt.status);
  };

  const handleUpdate = async () => {
    if (!editingReceipt) return;
    
    if (!receiptNo || !franchiseName || !franchiseId || !date || !course || !student || !studentId || !totalFee || !amountPaid) {
      toast.error("Please fill in all required fields");
      return;
    }

    const check = await validateStudentSelection({
      studentId,
      expectedCourse: course,
      expectedFee: totalFee,
    });
    if (!check.ok) {
      toast.error(check.message);
      return;
    }

    try {
      const calculatedAmountDue = parseFloat(totalFee) - parseFloat(amountPaid);
      
      await update(editingReceipt.id, {
        receipt_no: receiptNo,
        franchise_name: franchiseName,
        franchise_id: franchiseId,
        receipt_date: date,
        course,
        student,
        student_id: studentId,
        total_fee: parseFloat(totalFee),
        amount_paid: parseFloat(amountPaid),
        payment_details: paymentDetails,
        amount_due: calculatedAmountDue,
        status
      });

      setEditingReceipt(null);
      handleReset();
      toast.success("Fees receipt updated successfully!");
    } catch (error) {
      toast.error("Failed to update fees receipt");
    }
  };

  const handleAdd = async () => {
    if (editingReceipt) {
      await handleUpdate();
      return;
    }

    if (!receiptNo || !franchiseName || !franchiseId || !date || !course || !student || !studentId || !totalFee || !amountPaid) {
      toast.error("Please fill in all required fields");
      return;
    }

    const check = await validateStudentSelection({
      studentId,
      expectedCourse: course,
      expectedFee: totalFee,
    });
    if (!check.ok) {
      toast.error(check.message);
      return;
    }

    try {
      const calculatedAmountDue = parseFloat(totalFee) - parseFloat(amountPaid);
      
      await create({
        receipt_no: receiptNo,
        franchise_name: franchiseName,
        franchise_id: franchiseId,
        receipt_date: date,
        course,
        student,
        student_id: studentId,
        total_fee: parseFloat(totalFee),
        amount_paid: parseFloat(amountPaid),
        payment_details: paymentDetails,
        amount_due: calculatedAmountDue,
        status
      });

      handleReset();
      toast.success("Fees receipt added successfully!");
    } catch (error) {
      toast.error("Failed to add fees receipt");
    }
  };

  const handleReset = () => {
    setReceiptNo(`REC${String(feesReceipts.length + 1).padStart(3, '0')}`);
    setFranchiseName("");
    setFranchiseId("");
    setDate("");
    setCourse("");
    setStudent("");
    setStudentId("");
    setTotalFee("");
    setAmountPaid("");
    setPaymentDetails("");
    setAmountDue("");
    setStatus("Pending");
    setEditingReceipt(null);
  };


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this receipt?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Receipt deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete receipt");
    }
  };

  // Calculate amount due automatically
  const calculateAmountDue = () => {
    const total = parseFloat(totalFee) || 0;
    const paid = parseFloat(amountPaid) || 0;
    const due = total - paid;
    setAmountDue(due.toString());
  };

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
    const total = feesReceipts.length;
    const totalAmount = feesReceipts.reduce((sum, receipt) => sum + (receipt.total_fee || 0), 0);
    const paidAmount = feesReceipts.reduce((sum, receipt) => sum + (receipt.amount_paid || 0), 0);
    const dueAmount = feesReceipts.reduce((sum, receipt) => sum + (receipt.amount_due || 0), 0);
    
    return {
      total,
      totalAmount,
      paidAmount,
      dueAmount
    };
  }, [feesReceipts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading fees management...</p>
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
            <span>Fees Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Receipts */}
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Receipts</p>
                  <p className="text-3xl font-bold">{statistics.total}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Amount */}
          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Total Amount</p>
                  <p className="text-3xl font-bold" title={`₹${statistics.totalAmount.toLocaleString()}`}>{formatAmount(statistics.totalAmount)}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Paid */}
          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Amount Paid</p>
                  <p className="text-3xl font-bold" title={`₹${statistics.paidAmount.toLocaleString()}`}>{formatAmount(statistics.paidAmount)}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Due */}
          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Amount Due</p>
                  <p className="text-3xl font-bold text-foreground" title={`₹${statistics.dueAmount.toLocaleString()}`}>{formatAmount(statistics.dueAmount)}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Users className="h-6 w-6 text-foreground" />
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
              <span>{editingReceipt ? 'Edit Fee Receipt' : 'Enter Detail of Fee Receipt'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Registered Student
              </label>
              <StudentPicker
                value={studentId}
                onSelect={(s) => {
                  if (s.student_id) setStudentId(s.student_id);
                  setStudent(s.full_name);
                  if (s.course_name) setCourse(s.course_name);
                  if (s.course_fees) setTotalFee(s.course_fees);
                }}
                className="w-full"
              />
              <p className="text-[11px] text-muted-foreground mt-2">
                Picking a student auto-fills Student ID, Name, Course and Total Fee from registration.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Receipt No */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Receipt No *</label>
                <Input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter receipt number"
                />
              </div>

              {/* Franchise Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Franchise Name *</label>
                <Select value={franchiseName} onValueChange={setFranchiseName}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select franchise" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="franchise1" className="hover:bg-accent/50">Franchise 001</SelectItem>
                    <SelectItem value="franchise2" className="hover:bg-accent/50">Franchise 002</SelectItem>
                    <SelectItem value="franchise3" className="hover:bg-accent/50">Franchise 003</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Franchise ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Franchise ID *</label>
                <Input
                  type="text"
                  value={franchiseId}
                  onChange={(e) => setFranchiseId(e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter franchise ID"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date *</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              {/* Course */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course *</label>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="basic-computer" className="hover:bg-accent/50">Basic Computer Course</SelectItem>
                    <SelectItem value="advanced-computer" className="hover:bg-accent/50">Advanced Computer Course</SelectItem>
                    <SelectItem value="programming" className="hover:bg-accent/50">Programming Fundamentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student *</label>
                <Select value={student} onValueChange={setStudent}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="student1" className="hover:bg-accent/50">John Doe</SelectItem>
                    <SelectItem value="student2" className="hover:bg-accent/50">Jane Smith</SelectItem>
                    <SelectItem value="student3" className="hover:bg-accent/50">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student ID *</label>
                <Input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter student ID"
                />
              </div>

              {/* Total fee Of Student */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Total fee Of Student *</label>
                <Input
                  type="number"
                  value={totalFee}
                  onChange={(e) => {
                    setTotalFee(e.target.value);
                    calculateAmountDue();
                  }}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter total fee"
                />
              </div>

              {/* Amount Paid */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Amount Paid *</label>
                <Input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => {
                    setAmountPaid(e.target.value);
                    calculateAmountDue();
                  }}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter amount paid"
                />
              </div>

              {/* Amount Payment Details */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Amount Payment Details</label>
                <Input
                  type="text"
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter payment details"
                />
              </div>

              {/* Amount Due */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Amount Due</label>
                <Input
                  type="number"
                  value={amountDue}
                  onChange={(e) => setAmountDue(e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Calculated automatically"
                  readOnly
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status *</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="Paided" className="hover:bg-accent/50">Paided</SelectItem>
                    <SelectItem value="Pending" className="hover:bg-accent/50">Pending</SelectItem>
                    <SelectItem value="Partial" className="hover:bg-accent/50">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-border/20">
              <Button 
                onClick={handleAdd}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
              >
                {editingReceipt ? "UPDATE" : "ADD"}
              </Button>
              
              {editingReceipt && (
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="border-border/40 hover:bg-accent/20 px-8"
                >
                  Cancel Edit
                </Button>
              )}
              
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-border/40 hover:bg-accent/20 px-8"
              >
                RESET
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Receipts Table */}
        {feesReceipts.length > 0 ? (
          <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span>Fees Receipts ({feesReceipts.length})</span>
                </div>
                <div className="text-sm bg-background/20 px-3 py-1 rounded-full">
                  Total: {feesReceipts.length}
                </div>
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
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[150px]">Receipt No</th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[150px]">Franchise</th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[150px]">Student</th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[150px]">Course</th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">Total Fee</th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">Paid</th>
                        <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">Due</th>
                        <th className="px-6 py-4 text-sm font-bold text-center min-w-[120px]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feesReceipts.map((receipt, index) => (
                        <tr 
                          key={receipt.id} 
                          className={`border-b border-border/20 hover:bg-accent/20 transition-colors ${
                            index % 2 === 0 ? "bg-background/30" : "bg-accent/5"
                          }`}
                        >
                          <td className="border-r border-border/20 px-6 py-4">
                            <div className="flex justify-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(receipt)}
                                className="h-8 w-8 p-0 text-primary hover:text-primary/80 hover:bg-primary/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(receipt.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground font-medium">
                            {receipt.receipt_no}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground font-medium">
                            {receipt.franchise_name}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground font-medium">
                            {receipt.student}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground font-medium">
                            {receipt.course}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground font-medium">
                            ₹{receipt.total_fee.toFixed(2)}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground font-medium">
                            ₹{receipt.amount_paid.toFixed(2)}
                          </td>
                          <td className="border-r border-border/20 px-6 py-4 text-center text-foreground font-medium">
                            ₹{receipt.amount_due.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              receipt.status === 'Paided' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              receipt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                            }`}>
                              {receipt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                <Receipt className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Receipts Found</h3>
              <p className="text-muted-foreground">No fee receipts have been added yet. Create your first receipt using the form above.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeesManagementContent;