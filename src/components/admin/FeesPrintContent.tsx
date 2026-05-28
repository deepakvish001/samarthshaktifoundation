import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Search, Users, FileText, DollarSign, Calendar, Receipt, TrendingUp } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type FeeRecord = {
  id: string;
  student_id: string;
  student_name: string;
  course_name: string;
  roll_number: string;
  total_fee: number;
  fee_paid: number;
  fee_due: number;
  payment_date: string;
  receipt_id: string;
  payment_mode: string;
  status: string;
  created_at: string;
};

// Sample data for demonstration
const sampleFeeRecords: FeeRecord[] = [
  {
    id: "1",
    student_id: "STU001",
    student_name: "Rahul Kumar",
    course_name: "Computer Applications",
    roll_number: "CA2024001",
    total_fee: 15000,
    fee_paid: 10000,
    fee_due: 5000,
    payment_date: "2024-01-15",
    receipt_id: "RCP001",
    payment_mode: "Online",
    status: "Partial",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    student_id: "STU002",
    student_name: "Priya Singh",
    course_name: "Digital Marketing",
    roll_number: "DM2024002",
    total_fee: 12000,
    fee_paid: 12000,
    fee_due: 0,
    payment_date: "2024-01-20",
    receipt_id: "RCP002",
    payment_mode: "Cash",
    status: "Paid",
    created_at: "2024-01-20T11:15:00Z"
  },
  {
    id: "3",
    student_id: "STU003",
    student_name: "Amit Sharma",
    course_name: "Web Development",
    roll_number: "WD2024003",
    total_fee: 18000,
    fee_paid: 8000,
    fee_due: 10000,
    payment_date: "2024-01-10",
    receipt_id: "RCP003",
    payment_mode: "Bank Transfer",
    status: "Partial",
    created_at: "2024-01-10T09:45:00Z"
  }
];

const FeesPrintContent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(sampleFeeRecords[0]); // Default to first record
  const [searchResults, setSearchResults] = useState<FeeRecord[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter a student ID, roll number, or name to search",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate search with sample data
    setTimeout(() => {
      const results = sampleFeeRecords.filter(record => 
        record.student_id.toLowerCase().includes(searchValue.toLowerCase()) ||
        record.roll_number.toLowerCase().includes(searchValue.toLowerCase()) ||
        record.student_name.toLowerCase().includes(searchValue.toLowerCase())
      );

      setSearchResults(results);
      setShowSearchResults(true);
      setLoading(false);

      if (results.length > 0) {
        toast({
          title: "Success",
          description: `Found ${results.length} fee record(s)`,
        });
      } else {
        toast({
          title: "No Results",
          description: "No fee records found with the given criteria",
          variant: "destructive"
        });
      }
    }, 500);
  };

  const handleSelectRecord = (record: FeeRecord) => {
    setSelectedRecord(record);
    setShowSearchResults(false);
    toast({
      title: "Record Selected",
      description: `Selected fee record for ${record.student_name}`,
    });
  };

  const handlePrintReceipt = () => {
    if (!selectedRecord) {
      toast({
        title: "Error",
        description: "Please search and select a fee record first",
        variant: "destructive"
      });
      return;
    }
    window.print();
  };

  const generateReceiptPDF = async () => {
    if (!selectedRecord) {
      toast({
        title: "Error",
        description: "Please select a fee record first",
        variant: "destructive"
      });
      return;
    }

    if (!receiptRef.current) {
      toast({
        title: "Error",
        description: "Receipt template not found",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);
      
      toast({
        title: "Generating PDF",
        description: "Creating Professional Fee Receipt PDF...",
      });

      await new Promise((resolve) => setTimeout(resolve, 400));

      const element = receiptRef.current;

      const canvas = await html2canvas(element, {
        scale: Math.min(3, window.devicePixelRatio * 2),
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 12000,
      });

      const pdf = new jsPDF({ 
        orientation: 'portrait', 
        unit: 'mm', 
        format: 'a4', 
        compress: true 
      });
      
      const pdfWidth = 210;
      const margin = 10;
      const usableWidthMm = pdfWidth - margin * 2;
      
      const imgData = canvas.toDataURL('image/png');
      const aspectRatio = canvas.height / canvas.width;
      const heightMm = usableWidthMm * aspectRatio;

      pdf.addImage(imgData, 'PNG', margin, margin, usableWidthMm, heightMm, undefined, 'FAST');

      const currentDate = new Date().toISOString().split('T')[0];
      const sanitizedName = selectedRecord.student_name?.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_') || 'Student';
      const fileName = `${sanitizedName}_FeeReceipt_${currentDate}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Success",
        description: "Professional Fee Receipt PDF generated successfully!",
      });
    } catch (error: any) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: `Failed to generate PDF: ${error?.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const totalRecords = sampleFeeRecords.length;
  const paidRecords = sampleFeeRecords.filter(r => r.status === 'Paid').length;
  const partialRecords = sampleFeeRecords.filter(r => r.status === 'Partial').length;
  const totalAmount = sampleFeeRecords.reduce((sum, r) => sum + r.fee_paid, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Receipt className="h-8 w-8 text-primary" />
            </div>
            <span>Fees Print & Receipt</span>
          </h1>
          <div className="flex items-center">
            <Button 
              onClick={generateReceiptPDF}
              disabled={!selectedRecord || isGeneratingPDF}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-elegant px-8 py-3 text-base h-12 min-w-[220px] flex items-center justify-center"
            >
              <FileDown className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="font-medium">
                {isGeneratingPDF ? "Generating PDF..." : "Generate Professional PDF"}
              </span>
            </Button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Records</p>
                  <p className="text-3xl font-bold">{searchResults.length || totalRecords}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Paid Students</p>
                  <p className="text-3xl font-bold">{paidRecords}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Partial Payments</p>
                  <p className="text-3xl font-bold">{partialRecords}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Total Collected</p>
                  <p className="text-xl font-bold text-foreground">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <DollarSign className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                <Search className="h-6 w-6" />
              </div>
              <span>Search Fee Records</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 h-12 text-base"
                  placeholder="Enter Student ID, Roll Number, or Name"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8 h-12"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {showSearchResults && searchResults.length > 0 && (
          <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-secondary via-secondary/95 to-secondary/90 text-secondary-foreground p-8">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span>Fee Records ({searchResults.length})</span>
                </div>
                <Badge className="bg-background/20 text-secondary-foreground border-background/30">
                  Found: {searchResults.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((record) => (
                  <Card key={record.id} className="hover:shadow-lg transition-all duration-300 border-border/40 bg-background/50">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Name</p>
                          <p className="font-semibold text-foreground">{record.student_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Receipt ID</p>
                          <p className="text-foreground font-mono">{record.receipt_id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Course</p>
                          <Badge variant="secondary" className="text-xs">{record.course_name}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
                          <p className="text-foreground font-semibold text-green-600">₹{record.fee_paid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          <Badge variant={record.status === 'Paid' ? 'default' : 'destructive'} className="text-xs">
                            {record.status}
                          </Badge>
                        </div>
                        <Button 
                          onClick={() => handleSelectRecord(record)}
                          className="w-full mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                          size="sm"
                        >
                          Select Record
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Record Information & Receipt Preview - Always visible with default data */}
        <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-accent via-accent/95 to-accent/90 text-accent-foreground p-8">
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Receipt className="h-6 w-6" />
                </div>
                <span>Fee Receipt Certificate</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {selectedRecord && (
              <div ref={receiptRef} className="bg-white p-8 border shadow-lg max-w-4xl mx-auto">
                
                {/* Header Section with Logo */}
                <div className="flex items-start justify-between mb-8">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 border-4 border-pink-700 flex items-center justify-center shadow-lg">
                      <div className="text-center">
                        <div className="text-sm font-bold text-white leading-tight">B.Soft</div>
                        <div className="text-xs text-white leading-none">Computer &</div>
                        <div className="text-xs text-white leading-none">Technical</div>
                        <div className="text-xs text-white leading-none">Institute</div>
                      </div>
                    </div>
                  </div>

                  {/* Institute Header */}
                  <div className="flex-1 text-center ml-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-4 tracking-wider">
                      B. Soft Computer & Technical Institute
                    </h1>
                    <div className="text-sm text-gray-700 mb-2">
                      Near Union Bank Of India Bina Soft Educational & Welfare Society Vill & Post BILARIYAGAN J, AZAMGARH-276121
                    </div>
                    <div className="text-sm text-gray-700 mb-8">
                      infobinasoft@gmail.com
                    </div>
                  </div>
                </div>

                {/* Receipt Title */}
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-gray-800 underline">
                    Student Fee Receipt
                  </h2>
                </div>

                {/* Receipt Details */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Receipt ID:</span>
                      <span className="border-b border-gray-400 flex-1 min-h-[1.5rem] pl-2">{selectedRecord.receipt_id}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Name:</span>
                      <span className="border-b border-gray-400 flex-1 min-h-[1.5rem] pl-2">{selectedRecord.student_name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Course:</span>
                      <span className="border-b border-gray-400 flex-1 min-h-[1.5rem] pl-2">{selectedRecord.course_name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-24">Student ID:</span>
                      <span className="border-b border-gray-400 flex-1 min-h-[1.5rem] pl-2">{selectedRecord.student_id}</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-16">Date:</span>
                      <span className="border-b border-gray-400 flex-1 min-h-[1.5rem] pl-2">
                        {new Date(selectedRecord.payment_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-16">Roll No:</span>
                      <span className="border-b border-gray-400 flex-1 min-h-[1.5rem] pl-2">{selectedRecord.roll_number}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-20">Payment Mode:</span>
                      <span className="border-b border-gray-400 flex-1 min-h-[1.5rem] pl-2">{selectedRecord.payment_mode}</span>
                    </div>
                  </div>
                </div>

                {/* Fee Details */}
                <div className="space-y-4 mb-12">
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-24">Total fee:</span>
                    <span className="border-b border-gray-400 flex-1 min-h-[1.5rem] pl-2">₹{selectedRecord.total_fee.toLocaleString()}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-24">Fee Paid:</span>
                    <span className="border-b border-gray-400 flex-1 min-h-[1.5rem] pl-2 font-semibold text-green-600">
                      ₹{selectedRecord.fee_paid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-24">Fee Due:</span>
                    <span className="border-b border-gray-400 flex-1 min-h-[1.5rem] pl-2 font-semibold text-red-600">
                      ₹{selectedRecord.fee_due.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Office Sign */}
                <div className="flex">
                  <span className="font-medium text-gray-700 w-24">Office sign:</span>
                  <span className="border-b border-gray-400 flex-1 min-h-[1.5rem]"></span>
                </div>

              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeesPrintContent;