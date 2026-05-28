import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Search, Users, FileText, Building, Calendar, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type FranchiseData = {
  id: string;
  instituteName: string;
  centreHead: string;
  state: string;
  district: string;
  city: string;
  pinCode: string;
  dateOfRegistration: string;
  yearEstablishment: string;
  email: string;
  phone: string;
  designation: string;
  status: string;
  postalAddress: string;
  franchiseType: string;
};

const FranchiseRegPrintContent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<FranchiseData[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const franchiseCardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sample franchise data - in real app this would come from Supabase
  const allFranchises: FranchiseData[] = [
    {
      id: "FR001",
      instituteName: "B. Soft Computer & Technical Institute",
      centreHead: "Rahul Kumar",
      state: "Uttar Pradesh",
      district: "Azamgarh",
      city: "Bilariyagan",
      pinCode: "276121",
      dateOfRegistration: "2024-01-15",
      yearEstablishment: "2020",
      email: "infobinasoft@gmail.com",
      phone: "9876543210",
      designation: "Director",
      status: "active",
      postalAddress: "Near Union Bank Of India Bina Soft Educational & Welfare Society Vill & Post BILARIYAGAN J",
      franchiseType: "Computer Applications"
    },
    {
      id: "FR002", 
      instituteName: "Tech Learning Center",
      centreHead: "Jane Smith",
      state: "Maharashtra",
      district: "Mumbai",
      city: "Andheri",
      pinCode: "400058",
      dateOfRegistration: "2023-03-20",
      yearEstablishment: "2019",
      email: "info@techlearning.com",
      phone: "9123456789",
      designation: "Manager",
      status: "active",
      postalAddress: "Plot No. 15, Andheri West, Mumbai",
      franchiseType: "Digital Skills"
    },
    {
      id: "FR003",
      instituteName: "Digital Skills Academy",
      centreHead: "Mike Johnson",
      state: "Karnataka",
      district: "Bangalore",
      city: "Whitefield",
      pinCode: "560066",
      dateOfRegistration: "2023-02-10",
      yearEstablishment: "2021",
      email: "contact@digitalskills.edu",
      phone: "9998887776",
      designation: "Principal",
      status: "active",
      postalAddress: "ITPL Road, Whitefield, Bangalore",
      franchiseType: "Technical Training"
    },
    {
      id: "FR004",
      instituteName: "Excel Computer Education",
      centreHead: "Priya Sharma",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Malviya Nagar",
      pinCode: "302017",
      dateOfRegistration: "2023-05-12",
      yearEstablishment: "2018",
      email: "info@excelcomp.edu",
      phone: "9456781234",
      designation: "Director",
      status: "active",
      postalAddress: "C-45, Malviya Nagar, Near Metro Station, Jaipur",
      franchiseType: "Computer Education"
    },
    {
      id: "FR005",
      instituteName: "Smart Learning Hub",
      centreHead: "Amit Verma",
      state: "Delhi",
      district: "South Delhi",
      city: "Lajpat Nagar",
      pinCode: "110024",
      dateOfRegistration: "2023-08-18",
      yearEstablishment: "2022",
      email: "contact@smartlearning.org",
      phone: "9871234567",
      designation: "Principal",
      status: "active",
      postalAddress: "Shop No. 25, Lajpat Nagar Central Market, New Delhi",
      franchiseType: "Digital Literacy"
    },
    {
      id: "FR006",
      instituteName: "Future Tech Institute",
      centreHead: "Sunita Patel",
      state: "Gujarat",
      district: "Ahmedabad",
      city: "Satellite",
      pinCode: "380015",
      dateOfRegistration: "2023-04-22",
      yearEstablishment: "2019",
      email: "admin@futuretech.in",
      phone: "9825671234",
      designation: "CEO",
      status: "active",
      postalAddress: "301, Satellite Plaza, S.G. Highway, Ahmedabad",
      franchiseType: "Technology Training"
    },
    {
      id: "FR007",
      instituteName: "Progressive Education Center",
      centreHead: "Ravi Gupta",
      state: "Punjab",
      district: "Ludhiana",
      city: "Model Town",
      pinCode: "141002",
      dateOfRegistration: "2023-07-05",
      yearEstablishment: "2020",
      email: "info@progressive.edu",
      phone: "9814567890",
      designation: "Director",
      status: "active",
      postalAddress: "SCO-45, Model Town Extension, Ludhiana",
      franchiseType: "Skill Development"
    },
    {
      id: "FR008",
      instituteName: "Apex Computer Academy",
      centreHead: "Meera Singh",
      state: "Haryana",
      district: "Gurgaon",
      city: "Sector 14",
      pinCode: "122001",
      dateOfRegistration: "2023-06-30",
      yearEstablishment: "2017",
      email: "apex@computer.ac.in",
      phone: "9654321098",
      designation: "Principal",
      status: "active",
      postalAddress: "Plot 123, Sector 14, Old Gurgaon, Haryana",
      franchiseType: "Computer Training"
    },
    {
      id: "FR009",
      instituteName: "Innovation Learning Centre",
      centreHead: "Deepak Kumar",
      state: "Bihar",
      district: "Patna",
      city: "Boring Road",
      pinCode: "800001",
      dateOfRegistration: "2023-09-14",
      yearEstablishment: "2021",
      email: "innovation@learning.org",
      phone: "9431267890",
      designation: "Manager",
      status: "active",
      postalAddress: "Near AIIMS, Boring Road, Patna",
      franchiseType: "Vocational Training"
    },
    {
      id: "FR010",
      instituteName: "Modern Skills Institute",
      centreHead: "Kavita Yadav",
      state: "Madhya Pradesh",
      district: "Bhopal",
      city: "MP Nagar",
      pinCode: "462011",
      dateOfRegistration: "2023-11-08",
      yearEstablishment: "2022",
      email: "modern@skills.mp.gov.in",
      phone: "9755123456",
      designation: "Director",
      status: "active",
      postalAddress: "Zone-1, MP Nagar, Bhopal",
      franchiseType: "Modern Skills"
    }
  ];

  // Auto-fill mode - automatically select first franchise
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseData | null>(allFranchises[0]);

  const handleSearch = () => {
    if (!searchValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter a franchise ID, institute name, or centre head name to search",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = allFranchises.filter(franchise =>
        franchise.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        franchise.instituteName.toLowerCase().includes(searchValue.toLowerCase()) ||
        franchise.centreHead.toLowerCase().includes(searchValue.toLowerCase())
      );

      setSearchResults(results);
      setShowSearchResults(true);
      setLoading(false);

      if (results.length > 0) {
        toast({
          title: "Success",
          description: `Found ${results.length} franchise(s)`,
        });
      } else {
        toast({
          title: "No Results",
          description: "No franchises found with the given criteria",
          variant: "destructive"
        });
      }
    }, 500);
  };

  const handleSelectFranchise = (franchise: FranchiseData) => {
    setSelectedFranchise(franchise);
    setShowSearchResults(false);
    toast({
      title: "Franchise Selected",
      description: `Selected ${franchise.instituteName} for registration print`,
    });
  };

  const handleGenerateRegistrationPrint = () => {
    if (!selectedFranchise) {
      toast({
        title: "Error",
        description: "Please search and select a franchise first",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      toast({
        title: "Success",
        description: `Registration print generated successfully for ${selectedFranchise.instituteName}`,
      });

      // Update the selected franchise status locally
      setSelectedFranchise({
        ...selectedFranchise,
        status: 'generated'
      });
      
      setGenerating(false);
    }, 1000);
  };

  const handlePrintRegistration = () => {
    if (!selectedFranchise) {
      toast({
        title: "Error",
        description: "Please generate a registration print first",
        variant: "destructive"
      });
      return;
    }
    window.print();
  };

  const generateProfessionalPDF = async () => {
    if (!selectedFranchise) {
      toast({
        title: "Error",
        description: "Please select a franchise first",
        variant: "destructive"
      });
      return;
    }

    if (!franchiseCardRef.current) {
      toast({
        title: "Error",
        description: "Registration print template not found",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);
      
      // First generate the registration print
      setGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the selected franchise status locally
      setSelectedFranchise({
        ...selectedFranchise,
        status: 'generated'
      });
      setGenerating(false);

      toast({
        title: "Generating PDF",
        description: "Creating Professional Registration Print PDF...",
      });

      // Ensure layout and webfonts are fully ready
      if ((document as any).fonts?.ready) {
        await (document as any).fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 400));

      const element = franchiseCardRef.current;

      // High-DPI capture for crisp text
      const canvas = await html2canvas(element, {
        scale: Math.min(3, window.devicePixelRatio * 2),
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // A4 dimensions in points (1 point = 1/72 inch)
      const a4Width = 595.28;
      const a4Height = 841.89;

      // Create PDF with proper A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [a4Width, a4Height],
        compress: true
      });

      // Get image dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate scale to fit A4 with margins
      const margin = 40;
      const availableWidth = a4Width - (margin * 2);
      const availableHeight = a4Height - (margin * 2);

      const scaleWidth = availableWidth / imgWidth;
      const scaleHeight = availableHeight / imgHeight;
      const scale = Math.min(scaleWidth, scaleHeight);

      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      // Center the image
      const xOffset = margin + (availableWidth - scaledWidth) / 2;
      const yOffset = margin + (availableHeight - scaledHeight) / 2;

      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);

      // Generate filename
      const sanitizedName = selectedFranchise.instituteName.replace(/[^a-z0-9]/gi, '_');
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `${sanitizedName}_FranchiseRegistration_${currentDate}.pdf`;

      // Save the PDF
      pdf.save(fileName);

      toast({
        title: "Success",
        description: "Professional Registration Print PDF generated successfully!",
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Printer className="h-8 w-8 text-primary" />
            </div>
            <span>Franchise Registration Print</span>
          </h1>
          <Button 
            onClick={generateProfessionalPDF}
            disabled={!selectedFranchise || isGeneratingPDF || generating}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-elegant px-8 py-3 text-base"
          >
            <FileDown className="h-5 w-5 mr-2" />
            {isGeneratingPDF || generating ? "Generating PDF..." : "Generate Professional PDF"}
          </Button>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Search Results</p>
                  <p className="text-3xl font-bold">{searchResults.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Search className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Selected Franchise</p>
                  <p className="text-3xl font-bold">{selectedFranchise ? '1' : '0'}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Building className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Prints Generated</p>
                  <p className="text-3xl font-bold">{selectedFranchise && selectedFranchise.status === 'generated' ? '1' : '0'}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Franchise Type</p>
                  <p className="text-xl font-bold text-foreground">{selectedFranchise ? selectedFranchise.franchiseType : 'None'}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Users className="h-6 w-6 text-foreground" />
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
              <span>Search Franchise</span>
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
                  placeholder="Enter Franchise ID, Institute Name, or Centre Head Name"
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
        {showSearchResults && (
          <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-secondary via-secondary/95 to-secondary/90 text-secondary-foreground p-8">
              <CardTitle className="text-2xl font-bold flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                  <Building className="h-6 w-6" />
                </div>
                <span>Search Results ({searchResults.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {searchResults.map((franchise) => (
                  <div 
                    key={franchise.id}
                    className="p-6 border border-border/40 rounded-lg bg-background/50 hover:bg-accent/20 transition-all duration-200 cursor-pointer"
                    onClick={() => handleSelectFranchise(franchise)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            {franchise.id}
                          </Badge>
                          <h3 className="text-lg font-semibold text-foreground">{franchise.instituteName}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Centre Head:</span> {franchise.centreHead}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {franchise.city}, {franchise.state}
                          </div>
                          <div>
                            <span className="font-medium">Registration:</span> {new Date(franchise.dateOfRegistration).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-primary/30 text-primary hover:bg-primary/10"
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Franchise Registration Print Preview */}
        {selectedFranchise && (
          <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground p-8">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-background/20 rounded-lg backdrop-blur-sm">
                    <Building className="h-6 w-6" />
                  </div>
                  <span>Franchise Registration Certificate</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handlePrintRegistration}
                    className="bg-background/20 hover:bg-background/30 text-primary-foreground border-background/30"
                    variant="outline"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            {/* Print Template */}
            <CardContent className="p-8">
              <div ref={franchiseCardRef} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto" style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                minHeight: '210mm',
                width: '210mm',
                margin: '0 auto'
              }}>
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-600">
                  {/* Left Logo/Icon */}
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    <div className="text-center">
                      <div>B.Soft</div>
                      <div className="text-xs">Computer &</div>
                      <div className="text-xs">Technical</div>
                      <div className="text-xs">Institute</div>
                    </div>
                  </div>
                  
                  {/* Center Header */}
                  <div className="text-center flex-1">
                    <h1 className="text-2xl font-bold text-blue-600 mb-2">
                      B. Soft Computer & Technical Institute
                    </h1>
                    <p className="text-sm text-gray-600 max-w-lg mx-auto leading-tight">
                      Near Union Bank Of India Bina Soft Educational & Welfare Society<br />
                      Vill & Post BILARIYAGAN J, AZAMGARH-276121
                    </p>
                    <p className="text-sm text-gray-600 mt-1">infobinasoft@gmail.com</p>
                  </div>
                  
                  {/* Right space for balance */}
                  <div className="w-16"></div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-gray-800 underline decoration-2">
                    Franchise Registration Certificate
                  </h2>
                </div>

                {/* Registration Details */}
                <div className="space-y-4 mb-8">
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-32 shrink-0">Registration ID:</span>
                      <span className="border-b border-gray-400 flex-1 pb-1 text-gray-800 ml-2">
                        {selectedFranchise.id}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-24 shrink-0">Date:</span>
                      <span className="border-b border-gray-400 flex-1 pb-1 text-gray-800 ml-2">
                        {new Date(selectedFranchise.dateOfRegistration).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-32 shrink-0">Name:</span>
                      <span className="border-b border-gray-400 flex-1 pb-1 text-gray-800 ml-2">
                        {selectedFranchise.centreHead}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-24 shrink-0">Roll No:</span>
                      <span className="border-b border-gray-400 flex-1 pb-1 text-gray-800 ml-2">
                        {selectedFranchise.id}{new Date().getFullYear()}
                      </span>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-32 shrink-0">Course:</span>
                      <span className="border-b border-gray-400 flex-1 pb-1 text-gray-800 ml-2">
                        {selectedFranchise.franchiseType}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-24 shrink-0">Payment Mode:</span>
                      <span className="border-b border-gray-400 flex-1 pb-1 text-gray-800 ml-2">
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32 shrink-0">Franchise ID:</span>
                    <span className="border-b border-gray-400 flex-1 pb-1 text-gray-800 ml-2">
                      {selectedFranchise.id}
                    </span>
                  </div>

                  {/* Row 5 */}
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32 shrink-0">Total fee:</span>
                    <span className="border-b border-gray-400 flex-1 pb-1 text-gray-800 ml-2">
                      ₹15,000
                    </span>
                  </div>

                  {/* Row 6 */}
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32 shrink-0">Fee Paid:</span>
                    <span className="border-b border-gray-400 flex-1 pb-1 text-green-600 ml-2 font-medium">
                      ₹10,000
                    </span>
                  </div>

                  {/* Row 7 */}
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32 shrink-0">Fee Due:</span>
                    <span className="border-b border-gray-400 flex-1 pb-1 text-red-600 ml-2 font-medium">
                      ₹5,000
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-medium text-gray-700 mb-2">Office sign:</p>
                      <div className="mt-8 w-32 h-px bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FranchiseRegPrintContent;