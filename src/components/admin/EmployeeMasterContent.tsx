import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Edit, 
  Trash2, 
  Loader2, 
  Search, 
  TrendingUp, 
  UserCheck, 
  UserX, 
  BarChart3, 
  IndianRupee,
  Plus,
  Filter,
  RefreshCw,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Camera,
  Upload,
  Building,
  Home,
  CreditCard,
  Shield,
  Activity,
  Hash,
  IdCard,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface Employee {
  id: string;
  employee_id: string;
  employee_password: string;
  full_name: string;
  father_name?: string;
  contact_no: string;
  email_id: string;
  country?: string;
  state?: string;
  district?: string;
  address?: string;
  other_details?: string;
  pincode?: string;
  salary?: string;
  registration_date?: string;
  photo_url?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

const EmployeeMasterContent = () => {
  const {
    data: employees,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<Employee>({ tableName: 'employees' });

  useAdminRealTime({
    tableName: 'employees'
  });
  
  const [formData, setFormData] = useState({
    employeeId: "EMP021",
    employeePassword: "Bdcid021",
    fullName: "",
    fatherName: "",
    contactNo: "",
    emailId: "",
    country: "India",
    state: "",
    district: "",
    address: "",
    otherDetails: "",
    pincode: "",
    salary: "",
    registrationDate: "",
    photoUpload: null as File | null
  });

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const districts = [
    "Agra", "Allahabad", "Azamgarh", "Bareilly", "Ghaziabad", "Gorakhpur",
    "Kanpur", "Lucknow", "Meerut", "Moradabad", "Saharanpur", "Varanasi"
  ];

  // Statistics calculation
  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(emp => emp.status === 'active').length;
    const inactive = total - active;
    const avgSalary = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || '0'), 0) / (total || 1);
    
    return {
      total,
      active,
      inactive,
      avgSalary: Math.round(avgSalary)
    };
  }, [employees]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = 
        employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.contact_no && employee.contact_no.includes(searchTerm));
      
      const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort data
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateA - dateB;
        });
        break;
      case "name":
        filtered.sort((a, b) => a.full_name.localeCompare(b.full_name));
        break;
      case "salary":
        filtered.sort((a, b) => parseFloat(b.salary || '0') - parseFloat(a.salary || '0'));
        break;
      default:
        break;
    }

    return filtered;
  }, [employees, searchTerm, statusFilter, sortBy]);

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('photoUpload', file);
    }
  };

  const handleSubmit = async () => {
    if (editingEmployee) {
      await handleUpdate();
      return;
    }

    if (!formData.fullName.trim() || !formData.contactNo.trim() || !formData.emailId.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newEmployee = {
      employee_id: formData.employeeId,
      employee_password: formData.employeePassword,
      full_name: formData.fullName,
      father_name: formData.fatherName,
      contact_no: formData.contactNo,
      email_id: formData.emailId,
      country: formData.country,
      state: formData.state,
      district: formData.district,
      address: formData.address,
      other_details: formData.otherDetails,
      pincode: formData.pincode,
      salary: formData.salary,
      registration_date: formData.registrationDate,
      photo_url: formData.photoUpload ? formData.photoUpload.name : null,
      status: 'active'
    };

    try {
      await create(newEmployee);
      handleReset();
      toast.success("Employee added successfully!");
    } catch (error) {
      toast.error("Failed to add employee");
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeId: employee.employee_id,
      employeePassword: employee.employee_password,
      fullName: employee.full_name,
      fatherName: employee.father_name || "",
      contactNo: employee.contact_no,
      emailId: employee.email_id,
      country: employee.country || "India",
      state: employee.state || "",
      district: employee.district || "",
      address: employee.address || "",
      otherDetails: employee.other_details || "",
      pincode: employee.pincode || "",
      salary: employee.salary || "",
      registrationDate: employee.registration_date || "",
      photoUpload: null
    });
  };

  const handleUpdate = async () => {
    if (!editingEmployee) return;
    
    if (!formData.fullName.trim() || !formData.contactNo.trim() || !formData.emailId.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedEmployee = {
      employee_id: formData.employeeId,
      employee_password: formData.employeePassword,
      full_name: formData.fullName,
      father_name: formData.fatherName,
      contact_no: formData.contactNo,
      email_id: formData.emailId,
      country: formData.country,
      state: formData.state,
      district: formData.district,
      address: formData.address,
      other_details: formData.otherDetails,
      pincode: formData.pincode,
      salary: formData.salary,
      registration_date: formData.registrationDate,
      photo_url: formData.photoUpload ? formData.photoUpload.name : null,
      status: 'active'
    };

    try {
      await update(editingEmployee.id, updatedEmployee);
      setEditingEmployee(null);
      handleReset();
      toast.success("Employee updated successfully!");
    } catch (error) {
      toast.error("Failed to update employee");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Employee deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  const handleReset = () => {
    setFormData({
      employeeId: "EMP021",
      employeePassword: "Bdcid021",
      fullName: "",
      fatherName: "",
      contactNo: "",
      emailId: "",
      country: "India",
      state: "",
      district: "",
      address: "",
      otherDetails: "",
      pincode: "",
      salary: "",
      registrationDate: "",
      photoUpload: null
    });
    setEditingEmployee(null);

    // Reset file input
    const fileInput = document.getElementById('employee-photo-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  if (loading) {
    return (
      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading employees...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Employee Master Portal</h1>
              <p className="text-primary-foreground/80">Manage employee data and workforce information</p>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Employees</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                  <p className="text-xs text-blue-200 mt-1">Registered staff</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Employees</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                  <p className="text-xs text-green-200 mt-1">Currently working</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <UserCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Inactive</p>
                  <p className="text-3xl font-bold">{stats.inactive}</p>
                  <p className="text-xs text-orange-200 mt-1">Not working</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <UserX className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Average Salary</p>
                  <p className="text-3xl font-bold">₹{stats.avgSalary.toLocaleString()}</p>
                  <p className="text-xs text-purple-200 mt-1">Monthly average</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <IndianRupee className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Master Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {editingEmployee ? 'Edit Employee Details' : 'Employee Registration Form'}
                  </span>
                  <p className="text-sm text-muted-foreground font-normal">Complete all sections to register new employee</p>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-primary/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Employee Information</h3>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">Required</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Employee ID */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Employee ID
                    </label>
                    <Input
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      className="border-2 border-border/80 bg-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                      readOnly
                    />
                  </div>

                  {/* Employee Password */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Employee Password
                    </label>
                    <Input
                      value={formData.employeePassword}
                      onChange={(e) => handleInputChange('employeePassword', e.target.value)}
                      className="border-2 border-border/80 bg-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                      readOnly
                    />
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Full Name *
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter full name"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>

                  {/* Father Name */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Father's Name
                    </label>
                    <Input
                      value={formData.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                      placeholder="Enter father's name"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>

                  {/* Contact No */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Contact Number *
                    </label>
                    <Input
                      value={formData.contactNo}
                      onChange={(e) => handleInputChange('contactNo', e.target.value)}
                      placeholder="Enter contact number"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>

                  {/* Email ID */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.emailId}
                      onChange={(e) => handleInputChange('emailId', e.target.value)}
                      placeholder="Enter email address"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Country
                    </label>
                    <Input
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="border-2 border-border/80 bg-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                      readOnly
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      State
                    </label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger className="border-2 border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 h-12">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      District
                    </label>
                    <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                      <SelectTrigger className="border-2 border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 h-12">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pincode */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Pincode
                    </label>
                    <Input
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="Enter pincode"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>

                  {/* Salary */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Salary
                    </label>
                    <Input
                      value={formData.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      placeholder="Enter salary amount"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>

                  {/* Registration Date */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Registration Date
                    </label>
                    <Input
                      type="date"
                      value={formData.registrationDate}
                      onChange={(e) => handleInputChange('registrationDate', e.target.value)}
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2 group md:col-span-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Address
                    </label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter complete address"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[80px] resize-none group-hover:border-primary/50 shadow-sm"
                    />
                  </div>

                  {/* Other Details */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Other Details
                    </label>
                    <Textarea
                      value={formData.otherDetails}
                      onChange={(e) => handleInputChange('otherDetails', e.target.value)}
                      placeholder="Enter additional details"
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[80px] resize-none group-hover:border-primary/50 shadow-sm"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2 group md:col-span-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Employee Photo
                    </label>
                    <div className="relative border-2 border-dashed border-border/80 rounded-lg p-6 bg-muted/50 hover:border-primary/50 transition-colors">
                      <input
                        id="employee-photo-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm font-medium text-foreground">
                          {formData.photoUpload ? formData.photoUpload.name : "Click to upload employee photo"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Drag & drop or click to browse (PNG, JPG, JPEG)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit and Reset Buttons */}
              <div className="flex gap-4 pt-6 border-t border-border">
                <Button 
                  onClick={handleSubmit} 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg"
                  size="lg"
                >
                  {editingEmployee ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Employee
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Employee
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} size="lg">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Controls */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Search & Filter Employees</h3>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees by name, ID, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-2 border-border/80 focus:border-primary">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 border-2 border-border/80 focus:border-primary">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">By Name</SelectItem>
                    <SelectItem value="salary">By Salary</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refresh()}
                  className="border-2 border-border/80 hover:border-primary"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Master Table */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-semibold text-foreground">
                  Employee Master Registry
                </CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">
                    Complete employee database with {filteredData.length} registered staff members
                  </p>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                    {filteredData.length} {filteredData.length === 1 ? 'Employee' : 'Employees'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredData.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-muted rounded-full">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">
                      {searchTerm ? "No employees found" : "No employees available"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchTerm ? "Try adjusting your search criteria or filters" : "Start by adding your first employee using the form above"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-b-2 border-border">
                      <TableHead className="w-[120px] font-semibold text-foreground">Actions</TableHead>
                      <TableHead className="min-w-[120px] font-semibold text-foreground">Employee ID</TableHead>
                      <TableHead className="min-w-[180px] font-semibold text-foreground">Name</TableHead>
                      <TableHead className="min-w-[140px] font-semibold text-foreground">Contact</TableHead>
                      <TableHead className="min-w-[200px] font-semibold text-foreground">Email</TableHead>
                      <TableHead className="min-w-[120px] font-semibold text-foreground">State</TableHead>
                      <TableHead className="min-w-[120px] font-semibold text-foreground">Salary</TableHead>
                      <TableHead className="w-[100px] font-semibold text-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((employee, index) => (
                      <TableRow 
                        key={employee.id} 
                        className={`hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <TableCell className="py-4">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(employee)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="Edit employee"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(employee.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete employee"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-mono text-sm font-medium">{employee.employee_id}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-medium text-foreground">{employee.full_name}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="font-mono text-sm">{employee.contact_no}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm text-muted-foreground">{employee.email_id}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm">{employee.state || 'N/A'}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm font-medium">
                            {employee.salary ? `₹${parseFloat(employee.salary).toLocaleString()}` : 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge 
                            variant={employee.status === 'active' ? "default" : "secondary"}
                            className={`${
                              employee.status === 'active' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-orange-100 text-orange-800 border-orange-200'
                            }`}
                          >
                            {employee.status || 'Active'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeMasterContent;
