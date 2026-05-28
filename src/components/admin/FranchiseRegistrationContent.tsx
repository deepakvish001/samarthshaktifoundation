import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Edit, Trash2, Loader2, FileText, Users, CheckCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface FranchiseRegistration {
  id: string;
  franchise_type: string;
  institute_sort_name: string;
  institute_full_name: string;
  year_of_establishment: string;
  postal_address: string;
  pin_code: string;
  city_town_village?: string;
  state_name: string;
  district_name: string;
  state_sort_name: string;
  district_sort_name: string;
  date_of_registration: string;
  mobile_country_code: string;
  mobile_number: string;
  email: string;
  centre_head_name: string;
  designation: string;
  head_state: string;
  head_district: string;
  head_postal_address: string;
  head_pin_code: string;
  head_mobile_number: string;
  head_email: string;
  head_date_of_birth?: string;
  gender?: string;
  educational_qualification?: string;
  experience?: string;
  marital_status?: string;
  religion?: string;
  infrastructure_data?: any;
  internet_connectivity?: string;
  connectivity_type?: string;
  internet_speed?: string;
  number_of_servers?: string;
  server_remark?: string;
  operating_system?: string;
  os_remark?: string;
  antivirus?: string;
  antivirus_remark?: string;
  printers_scanner?: string;
  printer_remark?: string;
  power_backup?: string;
  power_remark?: string;
  type_of_faculties?: string;
  number_of_faculties?: string;
  faculty_indicate?: string;
  documents?: any;
  status: string;
  approval_status: string;
  created_at: string;
}

const FranchiseRegistrationContent = () => {
  const {
    data: franchiseRegistrations,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<FranchiseRegistration>({
    tableName: 'franchise_registrations',
    orderBy: { column: 'created_at', ascending: false }
  });

  useAdminRealTime({
    tableName: 'franchise_registrations'
  });

  // Institute Information
  const [franchiseType, setFranchiseType] = useState("");
  const [instituteSortName, setInstituteSortName] = useState("");
  const [instituteFullName, setInstituteFullName] = useState("");
  const [yearOfEstablishment, setYearOfEstablishment] = useState("");
  const [postalAddress, setPostalAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [cityTownVillage, setCityTownVillage] = useState("");
  const [stateName, setStateName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [stateSortName, setStateSortName] = useState("");
  const [districtSortName, setDistrictSortName] = useState("");
  const [dateOfRegistration, setDateOfRegistration] = useState("");
  const [mobileCountryCode, setMobileCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");

  // Centre Head Information
  const [centreHeadName, setCentreHeadName] = useState("");
  const [designation, setDesignation] = useState("");
  const [headState, setHeadState] = useState("");
  const [headDistrict, setHeadDistrict] = useState("");
  const [headPostalAddress, setHeadPostalAddress] = useState("");
  const [headPinCode, setHeadPinCode] = useState("");
  const [headMobileNumber, setHeadMobileNumber] = useState("");
  const [headEmail, setHeadEmail] = useState("");
  const [headDateOfBirth, setHeadDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [educationalQualification, setEducationalQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [religion, setReligion] = useState("");

  // Infrastructure Facility
  const [infrastructureData, setInfrastructureData] = useState({
    directorRoom: { indicate: "", numberOfRoom: "", remark: "" },
    officeRoom: { indicate: "", numberOfRoom: "", remark: "" },
    theoryRoom: { indicate: "", numberOfRoom: "", remark: "" },
    practicalRoom: { indicate: "", numberOfRoom: "", remark: "" },
    staffRoom: { indicate: "", numberOfRoom: "", remark: "" },
    library: { indicate: "", numberOfRoom: "", remark: "" },
    reception: { indicate: "", numberOfRoom: "", remark: "" },
    waitingRoom: { indicate: "", numberOfRoom: "", remark: "" },
    toilet: { indicate: "", numberOfRoom: "", remark: "" },
    anyOtherRoom: { indicate: "", numberOfRoom: "", remark: "" }
  });

  // Connectivity & Software
  const [internetConnectivity, setInternetConnectivity] = useState("");
  const [connectivityType, setConnectivityType] = useState("");
  const [internetSpeed, setInternetSpeed] = useState("0.00 mb/second");
  const [numberOfServers, setNumberOfServers] = useState("");
  const [serverRemark, setServerRemark] = useState("");
  const [operatingSystem, setOperatingSystem] = useState("");
  const [osRemark, setOsRemark] = useState("");
  const [antivirus, setAntivirus] = useState("");
  const [antivirusRemark, setAntivirusRemark] = useState("");
  const [printersScanner, setPrintersScanner] = useState("");
  const [printerRemark, setPrinterRemark] = useState("");
  const [powerBackup, setPowerBackup] = useState("");
  const [powerRemark, setPowerRemark] = useState("");

  // Faculty Details
  const [typeOfFaculties, setTypeOfFaculties] = useState("");
  const [numberOfFaculties, setNumberOfFaculties] = useState("");
  const [facultyIndicate, setFacultyIndicate] = useState("");

  // Upload Documents
  const [documents, setDocuments] = useState({
    headPhoto: null,
    aadharCard: null,
    tradeLicense: null,
    labRoomPhoto: null,
    officeRoomPhoto: null,
    frontSidePhoto: null,
    lastQualification: null
  });

  // Declaration
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async () => {
    if (!franchiseType || !instituteSortName || !instituteFullName || !yearOfEstablishment || 
        !postalAddress || !pinCode || !stateName || !districtName || !dateOfRegistration || 
        !mobileNumber || !email || !centreHeadName || !designation || !acceptTerms) {
      toast.error("Please fill in all required fields and accept terms");
      return;
    }

    try {
      await create({
        franchise_type: franchiseType,
        institute_sort_name: instituteSortName,
        institute_full_name: instituteFullName,
        year_of_establishment: yearOfEstablishment,
        postal_address: postalAddress,
        pin_code: pinCode,
        city_town_village: cityTownVillage,
        state_name: stateName,
        district_name: districtName,
        state_sort_name: stateSortName,
        district_sort_name: districtSortName,
        date_of_registration: dateOfRegistration,
        mobile_country_code: mobileCountryCode,
        mobile_number: mobileNumber,
        email: email,
        centre_head_name: centreHeadName,
        designation: designation,
        head_state: headState,
        head_district: headDistrict,
        head_postal_address: headPostalAddress,
        head_pin_code: headPinCode,
        head_mobile_number: headMobileNumber,
        head_email: headEmail,
        head_date_of_birth: headDateOfBirth,
        gender: gender,
        educational_qualification: educationalQualification,
        experience: experience,
        marital_status: maritalStatus,
        religion: religion,
        infrastructure_data: infrastructureData,
        internet_connectivity: internetConnectivity,
        connectivity_type: connectivityType,
        internet_speed: internetSpeed,
        number_of_servers: numberOfServers,
        server_remark: serverRemark,
        operating_system: operatingSystem,
        os_remark: osRemark,
        antivirus: antivirus,
        antivirus_remark: antivirusRemark,
        printers_scanner: printersScanner,
        printer_remark: printerRemark,
        power_backup: powerBackup,
        power_remark: powerRemark,
        type_of_faculties: typeOfFaculties,
        number_of_faculties: numberOfFaculties,
        faculty_indicate: facultyIndicate,
        documents: documents,
        status: 'pending',
        approval_status: 'pending'
      });

      handleReset();
      toast.success("Franchise registration submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit franchise registration");
    }
  };

  const handleReset = () => {
    setFranchiseType("");
    setInstituteSortName("");
    setInstituteFullName("");
    setYearOfEstablishment("");
    setPostalAddress("");
    setPinCode("");
    setCityTownVillage("");
    setStateName("");
    setDistrictName("");
    setStateSortName("");
    setDistrictSortName("");
    setDateOfRegistration("");
    setMobileCountryCode("+91");
    setMobileNumber("");
    setEmail("");

    setCentreHeadName("");
    setDesignation("");
    setHeadState("");
    setHeadDistrict("");
    setHeadPostalAddress("");
    setHeadPinCode("");
    setHeadMobileNumber("");
    setHeadEmail("");
    setHeadDateOfBirth("");
    setGender("");
    setEducationalQualification("");
    setExperience("");
    setMaritalStatus("");
    setReligion("");

    setInfrastructureData({
      directorRoom: { indicate: "", numberOfRoom: "", remark: "" },
      officeRoom: { indicate: "", numberOfRoom: "", remark: "" },
      theoryRoom: { indicate: "", numberOfRoom: "", remark: "" },
      practicalRoom: { indicate: "", numberOfRoom: "", remark: "" },
      staffRoom: { indicate: "", numberOfRoom: "", remark: "" },
      library: { indicate: "", numberOfRoom: "", remark: "" },
      reception: { indicate: "", numberOfRoom: "", remark: "" },
      waitingRoom: { indicate: "", numberOfRoom: "", remark: "" },
      toilet: { indicate: "", numberOfRoom: "", remark: "" },
      anyOtherRoom: { indicate: "", numberOfRoom: "", remark: "" }
    });

    setInternetConnectivity("");
    setConnectivityType("");
    setInternetSpeed("0.00 mb/second");
    setNumberOfServers("");
    setServerRemark("");
    setOperatingSystem("");
    setOsRemark("");
    setAntivirus("");
    setAntivirusRemark("");
    setPrintersScanner("");
    setPrinterRemark("");
    setPowerBackup("");
    setPowerRemark("");

    setTypeOfFaculties("");
    setNumberOfFaculties("");
    setFacultyIndicate("");

    setDocuments({
      headPhoto: null,
      aadharCard: null,
      tradeLicense: null,
      labRoomPhoto: null,
      officeRoomPhoto: null,
      frontSidePhoto: null,
      lastQualification: null
    });

    setAcceptTerms(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Registration deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete registration");
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-none bg-gradient-to-br from-background via-background/95 to-secondary/10 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading franchise registrations...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalRegistrations = franchiseRegistrations?.length || 0;
  const pendingRegistrations = franchiseRegistrations?.filter(reg => reg.approval_status === 'pending').length || 0;
  const approvedRegistrations = franchiseRegistrations?.filter(reg => reg.approval_status === 'approved').length || 0;
  const thisMonthRegistrations = franchiseRegistrations?.filter(reg => {
    const regDate = new Date(reg.created_at);
    const now = new Date();
    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
  }).length || 0;

  const updateInfrastructure = (roomType: string, field: string, value: string) => {
    setInfrastructureData(prev => ({
      ...prev,
      [roomType]: {
        ...prev[roomType as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Total Registrations</p>
                <p className="text-3xl font-bold">{totalRegistrations}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm font-medium">Pending Approval</p>
                <p className="text-3xl font-bold">{pendingRegistrations}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-foreground/80 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold">{approvedRegistrations}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground/80 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-foreground">{thisMonthRegistrations}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Franchise Registration Form */}
      <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <CardTitle className="text-xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-background/20 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
            <span>Franchise Registration Form</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-0 border-2 border-border">
            {/* Institute Information */}
            <div className="border-collapse">
              <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium border-b-2 border-border">
                Institute Information
              </div>
              
              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                    Franchise Type *
                  </div>
                  <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                    <Select value={franchiseType} onValueChange={setFranchiseType}>
                      <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                        <SelectValue placeholder="Select One" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="type1">Type 1</SelectItem>
                        <SelectItem value="type2">Type 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                    Name of the Institute *
                  </div>
                  <div className="col-span-4 px-3 py-2 border-r-2 border-gray-600 flex items-center bg-blue-50">
                    <Input
                      placeholder="Institute Sort Name"
                      value={instituteSortName}
                      onChange={(e) => setInstituteSortName(e.target.value)}
                      className="h-8 text-xs border-2 border-gray-400"
                    />
                  </div>
                  <div className="col-span-5 px-3 py-2 flex items-center bg-white">
                    <Input
                      placeholder="Institute Full Name"
                      value={instituteFullName}
                      onChange={(e) => setInstituteFullName(e.target.value)}
                      className="h-8 text-xs border-2 border-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                    Year of Establishment *
                  </div>
                  <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                    <Select value={yearOfEstablishment} onValueChange={setYearOfEstablishment}>
                      <SelectTrigger className="h-8 text-xs border-2 border-gray-400 max-w-xs">
                        <SelectValue placeholder="Select One" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 border-collapse">
                  <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-start pt-4 bg-white">
                    Postal Address *
                  </div>
                  <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                    <Textarea
                      value={postalAddress}
                      onChange={(e) => setPostalAddress(e.target.value)}
                      className="min-h-[60px] text-xs border-2 border-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                    Pin Code *
                  </div>
                  <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                    <Input
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="h-8 text-xs border-2 border-gray-400 max-w-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                    City / Town / Village
                  </div>
                  <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                    <Input
                      value={cityTownVillage}
                      onChange={(e) => setCityTownVillage(e.target.value)}
                      className="h-8 text-xs border-2 border-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                    State & District *
                  </div>
                  <div className="col-span-4 px-3 py-2 border-r-2 border-gray-600 flex items-center bg-white">
                    <Select value={stateName} onValueChange={setStateName}>
                      <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="bihar">Bihar</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5 px-3 py-2 flex items-center bg-blue-50">
                    <Select value={districtName} onValueChange={setDistrictName}>
                      <SelectTrigger className="h-8 text-xs border-2 border-gray-400">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="azamgarh">Azamgarh</SelectItem>
                        <SelectItem value="mau">Mau</SelectItem>
                        <SelectItem value="baliya">Baliya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                    Registration Date *
                  </div>
                  <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                    <Input
                      type="date"
                      value={dateOfRegistration}
                      onChange={(e) => setDateOfRegistration(e.target.value)}
                      className="h-8 text-xs border-2 border-gray-400 max-w-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                    Contact Details *
                  </div>
                  <div className="col-span-4 px-3 py-2 border-r-2 border-gray-600 flex items-center bg-white">
                    <Input
                      placeholder="Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="h-8 text-xs border-2 border-gray-400"
                    />
                  </div>
                  <div className="col-span-5 px-3 py-2 flex items-center bg-blue-50">
                    <Input
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-8 text-xs border-2 border-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Information About Centre Head */}
            <div className="border-collapse">
              <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium border-b-2 border-border">
                Information About Centre Head
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                    Name of Centre Head *
                  </div>
                  <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                    <Input
                      value={centreHeadName}
                      onChange={(e) => setCentreHeadName(e.target.value)}
                      className="h-8 text-xs border-2 border-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                    Designation *
                  </div>
                  <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                    <Input
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="h-8 text-xs border-2 border-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 bg-blue-100 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center">
                    Gender
                  </div>
                  <div className="col-span-9 px-3 py-2 flex items-center bg-white">
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="h-8 text-xs border-2 border-gray-400 max-w-xs">
                        <SelectValue placeholder="Select One" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-gray-600">
                <div className="grid grid-cols-12 min-h-[45px] border-collapse">
                  <div className="col-span-3 px-4 py-2 border-r-2 border-gray-600 text-sm font-medium text-gray-700 flex items-center bg-white">
                    Date of Birth
                  </div>
                  <div className="col-span-9 px-3 py-2 flex items-center bg-blue-50">
                    <Input
                      type="date"
                      value={headDateOfBirth}
                      onChange={(e) => setHeadDateOfBirth(e.target.value)}
                      className="h-8 text-xs border-2 border-gray-400 max-w-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="border-collapse">
              <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium border-b-2 border-border">
                Declaration
              </div>

              <div className="p-6">
                <div className="bg-green-200 p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                    />
                    <label htmlFor="terms" className="text-sm font-medium">
                      * I read the Terms & Conditions
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSubmit}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-medium"
                    >
                      Submit Now
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-base font-medium"
                    >
                      Reset Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Franchise Registrations Table */}
      {franchiseRegistrations && franchiseRegistrations.length > 0 && (
        <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="text-xl font-bold flex items-center space-x-3">
                <div className="p-2 bg-background/20 rounded-lg">
                  <Building className="h-5 w-5" />
                </div>
                <span>Franchise Registrations ({totalRegistrations} registrations)</span>
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Actions</TableHead>
                    <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Institute</TableHead>
                    <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Type</TableHead>
                    <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Centre Head</TableHead>
                    <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Contact</TableHead>
                    <TableHead className="text-white font-bold text-center py-4 border-r border-blue-500">Status</TableHead>
                    <TableHead className="text-white font-bold text-center py-4">Approval</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {franchiseRegistrations.map((registration, index) => (
                    <TableRow key={registration.id} className={`${index % 2 === 0 ? "bg-blue-50/50" : "bg-white"} hover:bg-blue-100/50 transition-colors`}>
                      <TableCell className="p-4 border-r border-gray-200">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(registration.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-gray-200">
                        <div>
                          <div className="font-semibold text-gray-800">{registration.institute_sort_name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">{registration.institute_full_name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-gray-200 font-medium text-gray-700">
                        {registration.franchise_type}
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-gray-200">
                        <div>
                          <div className="font-medium text-gray-800">{registration.centre_head_name}</div>
                          <div className="text-sm text-gray-500">{registration.designation}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-gray-200">
                        <div>
                          <div className="text-sm text-gray-700">{registration.email}</div>
                          <div className="text-sm text-gray-500">{registration.mobile_number}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-gray-200">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          registration.status === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {registration.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          registration.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          registration.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {registration.approval_status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {(!franchiseRegistrations || franchiseRegistrations.length === 0) && (
        <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-muted/20 rounded-full">
                <Building className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">No registrations found</h3>
                <p className="text-muted-foreground">Submit your first franchise registration to get started.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FranchiseRegistrationContent;
