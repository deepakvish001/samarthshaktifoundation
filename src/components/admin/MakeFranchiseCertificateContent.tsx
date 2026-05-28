import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { 
  Loader2, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Award, 
  Calendar, 
  FileText, 
  Building, 
  MapPin,
  Download,
  Printer,
  CheckCircle,
  Clock
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface FranchiseCertificate {
  id: string;
  institute_name: string;
  center_id: string;
  from_date: string;
  to_date: string;
  city_name: string;
  area: string;
  operating_for: string;
  certificate_number: string;
  issue_date: string;
  status: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  validity_period: string;
  certificate_type: string;
}

const MakeFranchiseCertificateContent = () => {
  const {
    data: certificates,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<FranchiseCertificate>({ 
    tableName: 'franchise_certificates',
    orderBy: { column: 'created_at', ascending: false }
  });
  
  const [formData, setFormData] = useState({
    instituteName: "",
    centerId: "",
    fromDate: "",
    toDate: "",
    cityName: "",
    area: "",
    operatingFor: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    certificateType: "franchise_authorization",
    validityPeriod: "5_years"
  });

  const [editingCertificate, setEditingCertificate] = useState<FranchiseCertificate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const { toast: useToastHook } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateCertificateNumber = () => {
    const prefix = "FC";
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${year}${random}`;
  };

  const handleSubmit = async () => {
    if (!formData.instituteName || !formData.centerId || !formData.fromDate || !formData.toDate) {
      toast.error("Please fill in required fields");
      return;
    }

    const certificateData = {
      institute_name: formData.instituteName,
      center_id: formData.centerId,
      from_date: formData.fromDate,
      to_date: formData.toDate,
      city_name: formData.cityName,
      area: formData.area,
      operating_for: formData.operatingFor,
      contact_person: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      certificate_number: editingCertificate?.certificate_number || generateCertificateNumber(),
      issue_date: new Date().toISOString().split('T')[0],
      status: "active",
      validity_period: formData.validityPeriod,
      certificate_type: formData.certificateType
    };

    try {
      if (editingCertificate) {
        await update(editingCertificate.id, certificateData);
        toast.success("Certificate updated successfully!");
      } else {
        await create(certificateData);
        toast.success("Certificate created successfully!");
      }
      
      handleReset();
    } catch (error) {
      toast.error(`Failed to ${editingCertificate ? 'update' : 'create'} certificate`);
    }
  };

  const handleEdit = (certificate: FranchiseCertificate) => {
    setEditingCertificate(certificate);
    setFormData({
      instituteName: certificate.institute_name,
      centerId: certificate.center_id,
      fromDate: certificate.from_date,
      toDate: certificate.to_date,
      cityName: certificate.city_name,
      area: certificate.area,
      operatingFor: certificate.operating_for,
      contactPerson: certificate.contact_person || "",
      email: certificate.email || "",
      phone: certificate.phone || "",
      address: certificate.address || "",
      certificateType: certificate.certificate_type,
      validityPeriod: certificate.validity_period
    });
  };

  const handleReset = () => {
    setEditingCertificate(null);
    setFormData({
      instituteName: "",
      centerId: "",
      fromDate: "",
      toDate: "",
      cityName: "",
      area: "",
      operatingFor: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      certificateType: "franchise_authorization",
      validityPeriod: "5_years"
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Certificate deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete certificate");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await update(id, { status: newStatus });
      toast.success(`Certificate status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update certificate status");
    }
  };

  const generateCertificatePDF = async (certificate: FranchiseCertificate) => {
    if (!certificateRef.current) {
      toast.error("Certificate template not found");
      return;
    }

    try {
      setIsGeneratingPDF(true);
      
      toast.success("Generating certificate PDF...");

      // Ensure layout and webfonts are fully ready
      if ((document as any).fonts?.ready) {
        await (document as any).fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = certificateRef.current;

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
      const sanitizedName = certificate.institute_name.replace(/[^a-z0-9]/gi, '_');
      const fileName = `${sanitizedName}_Certificate_${certificate.certificate_number}.pdf`;

      // Save the PDF
      pdf.save(fileName);

      toast.success("Certificate PDF generated successfully!");

    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Filter and search functionality
  const filteredData = useMemo(() => {
    let filtered = certificates || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.institute_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.center_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.certificate_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(item => item.certificate_type === filterType);
    }

    return filtered;
  }, [certificates, searchTerm, filterStatus, filterType]);

  const certificateTypes = ["franchise_authorization", "training_center", "examination_center", "study_center"];
  const validityPeriods = ["1_year", "2_years", "3_years", "5_years", "10_years"];
  const statusTypes = ["active", "expired", "suspended", "revoked"];

  // Sample data for demonstration
  const sampleData: FranchiseCertificate[] = [
    {
      id: "1",
      institute_name: "B.Soft Computer & Technical Institute",
      center_id: "UP/AZM/B.Soft/0007",
      from_date: "2018-01-01",
      to_date: "2025-01-01",
      city_name: "Azamgarh",
      area: "Jiyanpur",
      operating_for: "Computer Training & Education",
      certificate_number: "FC20240001",
      issue_date: "2024-01-01",
      status: "active",
      contact_person: "Rahul Kumar",
      email: "info@bsoft.edu",
      phone: "9876543210",
      address: "Near Union Bank, Jiyanpur, Azamgarh",
      validity_period: "5_years",
      certificate_type: "franchise_authorization"
    },
    {
      id: "2",
      institute_name: "Bina Soft Educational and Welfare Society",
      center_id: "SM11101",
      from_date: "2020-12-30",
      to_date: "2025-12-30",
      city_name: "Azamgarh",
      area: "Bilariyaganj",
      operating_for: "Educational Services",
      certificate_number: "FC20240002",
      issue_date: "2020-12-30",
      status: "active",
      contact_person: "Priya Sharma",
      email: "bina@educational.org",
      phone: "9123456789",
      address: "Bilariyaganj, Azamgarh",
      validity_period: "5_years",
      certificate_type: "training_center"
    },
    {
      id: "3",
      institute_name: "Bright Soft Computer Institute",
      center_id: "UP/Azm/B.Soft/000220",
      from_date: "2024-12-25",
      to_date: "2030-12-25",
      city_name: "Azamgarh",
      area: "Bilariyaganj",
      operating_for: "Computer Applications",
      certificate_number: "FC20240003",
      issue_date: "2024-12-25",
      status: "active",
      contact_person: "Amit Verma",
      email: "bright@computer.edu",
      phone: "9998887776",
      address: "Main Road, Bilariyaganj",
      validity_period: "5_years",
      certificate_type: "study_center"
    }
  ];

  const displayData = certificates?.length ? filteredData : sampleData.filter(item => {
    let filtered = true;
    
    if (searchTerm) {
      filtered = filtered && (
        item.institute_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.center_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.certificate_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== "all") {
      filtered = filtered && item.status === filterStatus;
    }

    if (filterType !== "all") {
      filtered = filtered && item.certificate_type === filterType;
    }
    
    return filtered;
  });

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading franchise certificates...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <span>Make Franchise Certificate</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Certificates</p>
                  <p className="text-3xl font-bold">{displayData.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Active</p>
                  <p className="text-3xl font-bold">
                    {displayData.filter(item => item.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Expiring Soon</p>
                  <p className="text-3xl font-bold">
                    {displayData.filter(item => {
                      const expiryDate = new Date(item.to_date);
                      const threeMonthsFromNow = new Date();
                      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
                      return expiryDate <= threeMonthsFromNow && item.status === 'active';
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold text-foreground">
                    {displayData.filter(item => {
                      const issueDate = new Date(item.issue_date);
                      const currentMonth = new Date().getMonth();
                      const currentYear = new Date().getFullYear();
                      return issueDate.getMonth() === currentMonth && issueDate.getFullYear() === currentYear;
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Calendar className="h-6 w-6 text-foreground" />
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
                <Award className="h-6 w-6" />
              </div>
              <span>{editingCertificate ? 'Edit Certificate' : 'Create New Certificate'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Institute Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Franchise Institute Name*</label>
                <Input
                  value={formData.instituteName}
                  onChange={(e) => handleInputChange('instituteName', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter institute name"
                />
              </div>

              {/* Center ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Center ID*</label>
                <Input
                  value={formData.centerId}
                  onChange={(e) => handleInputChange('centerId', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter center ID"
                />
              </div>

              {/* Certificate Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Certificate Type*</label>
                <Select value={formData.certificateType} onValueChange={(value) => handleInputChange('certificateType', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    {certificateTypes.map((type) => (
                      <SelectItem key={type} value={type} className="hover:bg-accent/50 capitalize">
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* From Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Valid From*</label>
                <Input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => handleInputChange('fromDate', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Valid Until*</label>
                <Input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => handleInputChange('toDate', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              {/* Validity Period */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Validity Period</label>
                <Select value={formData.validityPeriod} onValueChange={(value) => handleInputChange('validityPeriod', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    {validityPeriods.map((period) => (
                      <SelectItem key={period} value={period} className="hover:bg-accent/50 capitalize">
                        {period.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">City Name</label>
                <Input
                  value={formData.cityName}
                  onChange={(e) => handleInputChange('cityName', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter city name"
                />
              </div>

              {/* Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Area</label>
                <Input
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter area"
                />
              </div>

              {/* Operating For */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Operating For</label>
                <Input
                  value={formData.operatingFor}
                  onChange={(e) => handleInputChange('operatingFor', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter operating purpose"
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Contact Person</label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter contact person name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter email address"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-foreground">Address</label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="min-h-[80px] border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 resize-none"
                  placeholder="Enter complete address"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-border/20">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
              >
                {editingCertificate ? 'Update Certificate' : 'Create Certificate'}
              </Button>
              
              {editingCertificate && (
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
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by institute name, center ID, city, or certificate number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="w-full lg:w-48">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Status</SelectItem>
                    {statusTypes.map((status) => (
                      <SelectItem key={status} value={status} className="hover:bg-accent/50 capitalize">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full lg:w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Types</SelectItem>
                    {certificateTypes.map((type) => (
                      <SelectItem key={type} value={type} className="hover:bg-accent/50 capitalize">
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
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
                  <Building className="h-6 w-6" />
                </div>
                <span>Certificate Records ({displayData.length})</span>
              </div>
              <Badge className="bg-background/20 text-primary-foreground border-background/30">
                Total: {displayData.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="border border-border/40 rounded-lg bg-background/50 overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground">
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[140px]">
                        <div className="flex items-center justify-center gap-2">
                          <Edit className="h-4 w-4" />
                          Actions
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Institute Name
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Certificate #
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[180px]">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Validity Period
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        Type
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <Download className="h-4 w-4" />
                          Certificate
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-accent/10 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-background/50" : "bg-accent/5"
                        }`}
                      >
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(item)}
                              className="p-2 h-auto hover:bg-primary/10 hover:text-primary transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 h-auto hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div>
                            <p className="text-foreground font-medium">{item.institute_name}</p>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono text-xs mt-1">
                              {item.center_id}
                            </Badge>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground border-secondary/30 font-mono">
                            {item.certificate_number}
                          </Badge>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <div className="text-sm">
                            <p className="text-foreground font-medium">
                              {new Date(item.from_date).toLocaleDateString()} - {new Date(item.to_date).toLocaleDateString()}
                            </p>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs mt-1 ${
                                new Date(item.to_date) < new Date() 
                                  ? 'bg-red-100 text-red-800 border-red-300'
                                  : new Date(item.to_date) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                  : 'bg-green-100 text-green-800 border-green-300'
                              }`}
                            >
                              {item.validity_period.replace('_', ' ')}
                            </Badge>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="text-sm">
                            <p className="text-foreground font-medium">{item.city_name}</p>
                            <p className="text-muted-foreground">{item.area}</p>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <Badge 
                            variant="secondary" 
                            className="bg-accent/20 text-accent-foreground border-accent/30 capitalize text-xs"
                          >
                            {item.certificate_type.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <Select
                            value={item.status}
                            onValueChange={(value) => handleStatusUpdate(item.id, value)}
                          >
                            <SelectTrigger className="w-28 h-8 text-xs">
                              <Badge 
                                variant={
                                  item.status === 'active' 
                                    ? 'default' 
                                    : item.status === 'expired'
                                    ? 'secondary' 
                                    : 'destructive'
                                }
                                className={`border-0 capitalize ${
                                  item.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : item.status === 'expired'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : item.status === 'suspended'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {item.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {statusTypes.map((status) => (
                                <SelectItem key={status} value={status} className="capitalize">
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => generateCertificatePDF(item)}
                            disabled={isGeneratingPDF}
                            className="p-2 h-auto hover:bg-accent/20 transition-all duration-200 text-primary hover:text-primary/80"
                          >
                            {isGeneratingPDF ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {displayData.length === 0 && (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-muted/20 rounded-full">
                      <Award className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No certificates found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || filterStatus !== "all" || filterType !== "all"
                          ? "Try adjusting your search or filter criteria" 
                          : "Start by creating your first franchise certificate"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hidden Certificate Template for PDF Generation */}
        <div ref={certificateRef} className="fixed -left-[9999px] top-0 w-[800px] h-[600px] bg-white p-8 border-8 border-primary">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary">FRANCHISE CERTIFICATE</h1>
            <div className="text-xl font-semibold">This is to certify that</div>
            <div className="text-2xl font-bold text-primary border-b-2 border-primary pb-2 inline-block">
              {editingCertificate?.institute_name || displayData[0]?.institute_name}
            </div>
            <div className="text-lg">
              with Center ID: <span className="font-bold">{editingCertificate?.center_id || displayData[0]?.center_id}</span>
            </div>
            <div className="text-lg">
              is authorized to operate as a franchise center for
            </div>
            <div className="text-xl font-semibold text-primary">
              {editingCertificate?.operating_for || displayData[0]?.operating_for}
            </div>
            <div className="text-lg">
              Located at: {editingCertificate?.city_name || displayData[0]?.city_name}, {editingCertificate?.area || displayData[0]?.area}
            </div>
            <div className="text-lg">
              Valid from {editingCertificate?.from_date || displayData[0]?.from_date} to {editingCertificate?.to_date || displayData[0]?.to_date}
            </div>
            <div className="text-sm text-muted-foreground">
              Certificate Number: {editingCertificate?.certificate_number || displayData[0]?.certificate_number}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeFranchiseCertificateContent;