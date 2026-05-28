import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Search, Users, FileText, Building, Calendar, Printer, Award, CheckCircle } from "lucide-react";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type FranchiseCertificate = {
  id: string;
  franchise_id: string;
  franchise_name: string;
  centre_head: string;
  certificate_number: string;
  issue_date: string;
  valid_from: string;
  valid_to: string;
  operating_area: string;
  location: string;
  registration_number: string;
  certificate_type: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const GenerateFranchiseCertificateContent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedFranchise, setSelectedFranchise] = useState<FranchiseCertificate | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sample data - to be replaced with actual Supabase data
  const sampleCertificates: FranchiseCertificate[] = [
    {
      id: "1",
      franchise_id: "FR001",
      franchise_name: "B. Soft Computer & Technical Institute",
      centre_head: "Rahul Kumar",
      certificate_number: "CERT001/2024",
      issue_date: "2024-01-15",
      valid_from: "2024-01-15",
      valid_to: "2025-01-14",
      operating_area: "Azamgarh",
      location: "Bilariyagan, Uttar Pradesh",
      registration_number: "REG001/2024",
      certificate_type: "Franchise Authorization",
      status: "active",
      created_at: "2024-01-15T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z"
    },
    {
      id: "2",
      franchise_id: "FR002",
      franchise_name: "Tech Learning Center",
      centre_head: "Jane Smith",
      certificate_number: "CERT002/2024",
      issue_date: "2024-02-10",
      valid_from: "2024-02-10",
      valid_to: "2025-02-09",
      operating_area: "Mumbai",
      location: "Andheri, Maharashtra",
      registration_number: "REG002/2024",
      certificate_type: "Franchise Authorization",
      status: "active",
      created_at: "2024-02-10T00:00:00Z",
      updated_at: "2024-02-10T00:00:00Z"
    }
  ];

  const [certificates] = useState<FranchiseCertificate[]>(sampleCertificates);
  const [filteredCertificates, setFilteredCertificates] = useState<FranchiseCertificate[]>([]);

  const handleSearch = () => {
    if (!searchValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter a franchise ID to search",
        variant: "destructive"
      });
      return;
    }

    const results = certificates.filter(cert =>
      cert.franchise_id.toLowerCase().includes(searchValue.toLowerCase()) ||
      cert.franchise_name.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredCertificates(results);
    setShowSearch(true);

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
  };

  const handleSelectFranchise = (certificate: FranchiseCertificate) => {
    setSelectedFranchise(certificate);
    setShowSearch(false);
    toast({
      title: "Franchise Selected",
      description: `Selected ${certificate.franchise_name} for certificate generation`,
    });
  };

  const handlePrintCertificate = () => {
    if (!selectedFranchise) {
      toast({
        title: "Error",
        description: "Please select a franchise first",
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

    if (!certificateRef.current) {
      toast({
        title: "Error",
        description: "Certificate template not found",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);
      
      toast({
        title: "Generating PDF",
        description: "Creating Professional Certificate PDF...",
      });

      await new Promise((resolve) => setTimeout(resolve, 400));

      const element = certificateRef.current;

      const canvas = await html2canvas(element, {
        scale: Math.min(3, window.devicePixelRatio * 2),
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const a4Width = 595.28;
      const a4Height = 841.89;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [a4Width, a4Height],
        compress: true
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const margin = 40;
      const availableWidth = a4Width - (margin * 2);
      const availableHeight = a4Height - (margin * 2);

      const scaleWidth = availableWidth / imgWidth;
      const scaleHeight = availableHeight / imgHeight;
      const scale = Math.min(scaleWidth, scaleHeight);

      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      const xOffset = margin + (availableWidth - scaledWidth) / 2;
      const yOffset = margin + (availableHeight - scaledHeight) / 2;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);

      const sanitizedName = selectedFranchise.franchise_name.replace(/[^a-z0-9]/gi, '_');
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `${sanitizedName}_Certificate_${currentDate}.pdf`;

      pdf.save(fileName);

      toast({
        title: "Success",
        description: "Professional Certificate PDF generated successfully!",
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
              <Award className="h-8 w-8 text-primary" />
            </div>
            <span>Generate Franchise Certificate</span>
          </h1>
          <Button 
            onClick={generateProfessionalPDF}
            disabled={!selectedFranchise || isGeneratingPDF}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-elegant px-8 py-3 text-base"
          >
            <FileDown className="h-5 w-5 mr-2" />
            {isGeneratingPDF ? "Generating PDF..." : "Generate Professional PDF"}
          </Button>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Certificates</p>
                  <p className="text-3xl font-bold">{certificates.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Award className="h-6 w-6" />
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
                  <p className="text-accent-foreground/80 text-sm font-medium">Search Results</p>
                  <p className="text-3xl font-bold">{filteredCertificates.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Search className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">Certificate Type</p>
                  <p className="text-xl font-bold text-foreground">{selectedFranchise ? selectedFranchise.certificate_type : 'None'}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="shadow-elegant border-border/50">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/50">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <span>Search Franchise</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Franchise ID or Name
                </label>
                <Input 
                  type="text" 
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full"
                  placeholder="Enter Franchise ID or Name"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 px-8"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {showSearch && filteredCertificates.length > 0 && (
          <Card className="shadow-elegant border-border/50">
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10 border-b border-border/50">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-2">
                <Users className="h-5 w-5 text-secondary" />
                <span>Search Results ({filteredCertificates.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {filteredCertificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
                    onClick={() => handleSelectFranchise(certificate)}
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{certificate.franchise_name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {certificate.franchise_id} | Head: {certificate.centre_head}</p>
                      <p className="text-sm text-muted-foreground">Location: {certificate.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{certificate.status}</Badge>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectFranchise(certificate);
                        }}
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

        {/* Certificate Preview */}
        {selectedFranchise && (
          <Card className="shadow-elegant border-border/50">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-2">
                  <Award className="h-5 w-5 text-accent" />
                  <span>Certificate Preview</span>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrintCertificate}
                    className="hover:bg-secondary/10"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div 
                ref={certificateRef}
                className="bg-gradient-to-br from-background to-accent/5 border-2 border-primary/20 rounded-lg p-12 text-center space-y-8 shadow-inner"
                style={{ minHeight: '800px' }}
              >
                {/* Certificate Header */}
                <div className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Award className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-primary mb-2">
                    FRANCHISE CERTIFICATE
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Takniki Vikas Prashishan Sansthan
                  </p>
                </div>

                <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>

                {/* Certificate Content */}
                <div className="space-y-6 text-xl leading-relaxed text-foreground">
                  <p className="text-2xl font-semibold text-primary">
                    This is to certify that
                  </p>
                  
                  <p className="text-3xl font-bold text-foreground bg-accent/10 py-4 px-8 rounded-lg">
                    {selectedFranchise.franchise_name}
                  </p>
                  
                  <p>has been appointed as an authorized franchise by</p>
                  
                  <p className="text-2xl font-bold text-primary">
                    Takniki Vikas Prashishan Sansthan
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                    <div className="space-y-2">
                      <p><strong>From:</strong> {selectedFranchise.valid_from}</p>
                      <p><strong>To:</strong> {selectedFranchise.valid_to}</p>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Operating in:</strong> {selectedFranchise.operating_area}</p>
                      <p><strong>Located at:</strong> {selectedFranchise.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-12">
                    <p className="text-lg">
                      <strong>Certificate Number:</strong> {selectedFranchise.certificate_number}
                    </p>
                    <p className="text-lg">
                      <strong>Authorized Registration No.:</strong> {selectedFranchise.registration_number}
                    </p>
                    <p className="text-lg">
                      <strong>Issue Date:</strong> {selectedFranchise.issue_date}
                    </p>
                  </div>
                </div>

                <div className="w-32 h-1 bg-gradient-to-r from-secondary to-primary mx-auto"></div>

                {/* Certificate Footer */}
                <div className="flex justify-between items-end mt-16 pt-8">
                  <div className="text-center">
                    <div className="w-48 h-0.5 bg-border mb-2"></div>
                    <p className="text-sm text-muted-foreground">Authorized Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Official Seal</p>
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

export default GenerateFranchiseCertificateContent;