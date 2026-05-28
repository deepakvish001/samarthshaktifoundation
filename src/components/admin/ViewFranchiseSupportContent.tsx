import { useState, useMemo } from "react";
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
  HeadphonesIcon, 
  Calendar, 
  FileText, 
  Building, 
  Phone, 
  Mail,
  MessageCircle,
  UserCheck,
  Clock
} from "lucide-react";

interface FranchiseSupport {
  id: string;
  franchise_code: string;
  franchise_name: string;
  contact_person: string;
  email: string;
  phone: string;
  support_type: string;
  priority: string;
  subject: string;
  message: string;
  status: string;
  created_date: string;
  resolved_date?: string;
  assigned_to?: string;
  resolution_notes?: string;
}

const ViewFranchiseSupportContent = () => {
  const {
    data: supportTickets,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<FranchiseSupport>({ 
    tableName: 'franchise_support',
    orderBy: { column: 'created_at', ascending: false }
  });
  
  const [formData, setFormData] = useState({
    franchiseCode: "",
    franchiseName: "",
    contactPerson: "",
    email: "",
    phone: "",
    supportType: "technical",
    priority: "medium",
    subject: "",
    message: "",
    assignedTo: ""
  });

  const [editingTicket, setEditingTicket] = useState<FranchiseSupport | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const { toast: useToastHook } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.franchiseCode || !formData.subject || !formData.message) {
      toast.error("Please fill in required fields");
      return;
    }

    const supportTicket = {
      franchise_code: formData.franchiseCode,
      franchise_name: formData.franchiseName,
      contact_person: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      support_type: formData.supportType,
      priority: formData.priority,
      subject: formData.subject,
      message: formData.message,
      status: "open",
      created_date: new Date().toISOString().split('T')[0],
      assigned_to: formData.assignedTo || null
    };

    try {
      if (editingTicket) {
        await update(editingTicket.id, supportTicket);
        toast.success("Support ticket updated successfully!");
      } else {
        await create(supportTicket);
        toast.success("Support ticket created successfully!");
      }
      
      handleReset();
    } catch (error) {
      toast.error(`Failed to ${editingTicket ? 'update' : 'create'} support ticket`);
    }
  };

  const handleEdit = (ticket: FranchiseSupport) => {
    setEditingTicket(ticket);
    setFormData({
      franchiseCode: ticket.franchise_code,
      franchiseName: ticket.franchise_name,
      contactPerson: ticket.contact_person,
      email: ticket.email,
      phone: ticket.phone,
      supportType: ticket.support_type,
      priority: ticket.priority,
      subject: ticket.subject,
      message: ticket.message,
      assignedTo: ticket.assigned_to || ""
    });
  };

  const handleReset = () => {
    setEditingTicket(null);
    setFormData({
      franchiseCode: "",
      franchiseName: "",
      contactPerson: "",
      email: "",
      phone: "",
      supportType: "technical",
      priority: "medium",
      subject: "",
      message: "",
      assignedTo: ""
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this support ticket?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Support ticket deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete support ticket");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'resolved') {
        updates.resolved_date = new Date().toISOString().split('T')[0];
      }
      
      await update(id, updates);
      toast.success(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update ticket status");
    }
  };

  // Filter and search functionality
  const filteredData = useMemo(() => {
    let filtered = supportTickets || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.franchise_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.franchise_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(item => item.support_type === filterType);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Apply priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter(item => item.priority === filterPriority);
    }

    return filtered;
  }, [supportTickets, searchTerm, filterType, filterStatus, filterPriority]);

  const supportTypes = ["technical", "billing", "training", "general", "infrastructure"];
  const statusTypes = ["open", "in_progress", "resolved", "closed"];
  const priorityTypes = ["low", "medium", "high", "critical"];

  // Sample data for demonstration
  const sampleData: FranchiseSupport[] = [
    {
      id: "1",
      franchise_code: "PT/lk/bt/0001",
      franchise_name: "Tech Learning Center",
      contact_person: "Rahul Kumar",
      email: "rahul@techlearning.com",
      phone: "9690283407",
      support_type: "technical",
      priority: "high",
      subject: "Server connectivity issues",
      message: "Unable to connect to main server for student data sync",
      status: "open",
      created_date: "2024-01-15",
      assigned_to: "Support Team A"
    },
    {
      id: "2",
      franchise_code: "PT/dl/nm/0002", 
      franchise_name: "Digital Skills Academy",
      contact_person: "Priya Sharma",
      email: "priya@digitalskills.edu",
      phone: "9123456789",
      support_type: "billing",
      priority: "medium",
      subject: "Fee payment gateway error",
      message: "Students unable to complete online fee payments",
      status: "in_progress",
      created_date: "2024-01-14",
      assigned_to: "Finance Team"
    },
    {
      id: "3",
      franchise_code: "PT/mh/mb/0003",
      franchise_name: "Future Tech Institute", 
      contact_person: "Amit Verma",
      email: "amit@futuretech.in",
      phone: "9876543210",
      support_type: "training",
      priority: "low",
      subject: "Faculty training request",
      message: "Need training on new course curriculum",
      status: "resolved",
      created_date: "2024-01-12",
      resolved_date: "2024-01-13",
      assigned_to: "Training Team"
    }
  ];

  const displayData = supportTickets?.length ? filteredData : sampleData.filter(item => {
    let filtered = true;
    
    if (searchTerm) {
      filtered = filtered && (
        item.franchise_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.franchise_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== "all") {
      filtered = filtered && item.support_type === filterType;
    }
    
    if (filterStatus !== "all") {
      filtered = filtered && item.status === filterStatus;
    }

    if (filterPriority !== "all") {
      filtered = filtered && item.priority === filterPriority;
    }
    
    return filtered;
  });

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading franchise support tickets...</p>
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
              <HeadphonesIcon className="h-8 w-8 text-primary" />
            </div>
            <span>Franchise Support Management</span>
          </h1>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Total Tickets</p>
                  <p className="text-3xl font-bold">{displayData.length}</p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Open</p>
                  <p className="text-3xl font-bold">
                    {displayData.filter(item => item.status === 'open').length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold">
                    {displayData.filter(item => item.status === 'in_progress').length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <MessageCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Resolved</p>
                  <p className="text-3xl font-bold">
                    {displayData.filter(item => item.status === 'resolved').length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <UserCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-elegant border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground/80 text-sm font-medium">High Priority</p>
                  <p className="text-3xl font-bold text-foreground">
                    {displayData.filter(item => item.priority === 'high' || item.priority === 'critical').length}
                  </p>
                </div>
                <div className="p-3 bg-background/20 rounded-full">
                  <Filter className="h-6 w-6 text-foreground" />
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
                <HeadphonesIcon className="h-6 w-6" />
              </div>
              <span>{editingTicket ? 'Edit Support Ticket' : 'Create New Support Ticket'}</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Franchise Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Franchise Code*</label>
                <Input
                  value={formData.franchiseCode}
                  onChange={(e) => handleInputChange('franchiseCode', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter franchise code"
                />
              </div>

              {/* Franchise Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Franchise Name</label>
                <Input
                  value={formData.franchiseName}
                  onChange={(e) => handleInputChange('franchiseName', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter franchise name"
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

              {/* Support Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Support Type*</label>
                <Select value={formData.supportType} onValueChange={(value) => handleInputChange('supportType', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    {supportTypes.map((type) => (
                      <SelectItem key={type} value={type} className="hover:bg-accent/50 capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Priority*</label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    {priorityTypes.map((priority) => (
                      <SelectItem key={priority} value={priority} className="hover:bg-accent/50 capitalize">
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned To */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Assigned To</label>
                <Input
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter assignee name"
                />
              </div>

              {/* Subject */}
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-foreground">Subject*</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  placeholder="Enter ticket subject"
                />
              </div>

              {/* Message */}
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-foreground">Message*</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="min-h-[100px] border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20 resize-none"
                  placeholder="Describe the issue or request in detail"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-border/20">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg px-8"
              >
                {editingTicket ? 'Update Ticket' : 'Create Ticket'}
              </Button>
              
              {editingTicket && (
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
                  placeholder="Search by franchise code, name, subject, or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="w-full lg:w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Types</SelectItem>
                    {supportTypes.map((type) => (
                      <SelectItem key={type} value={type} className="hover:bg-accent/50 capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                        {status.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full lg:w-48">
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    <SelectItem value="all" className="hover:bg-accent/50">All Priority</SelectItem>
                    {priorityTypes.map((priority) => (
                      <SelectItem key={priority} value={priority} className="hover:bg-accent/50 capitalize">
                        {priority}
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
                <span>Support Tickets ({displayData.length})</span>
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
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <Edit className="h-4 w-4" />
                          Actions
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Franchise
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Contact
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-left min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Subject
                        </div>
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        Type
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        Priority
                      </th>
                      <th className="border-r border-primary/30 px-6 py-4 text-sm font-bold text-center min-w-[100px]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-center min-w-[120px]">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
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
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono mb-1">
                              {item.franchise_code}
                            </Badge>
                            <p className="text-foreground font-medium text-sm">{item.franchise_name}</p>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-foreground font-medium">{item.contact_person}</p>
                            <p className="text-muted-foreground text-sm">{item.email}</p>
                            <p className="text-muted-foreground text-sm">{item.phone}</p>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-foreground font-medium truncate" title={item.subject}>
                              {item.subject}
                            </p>
                            <p className="text-muted-foreground text-sm truncate" title={item.message}>
                              {item.message}
                            </p>
                          </div>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <Badge 
                            variant="secondary" 
                            className="bg-secondary/20 text-secondary-foreground border-secondary/30 capitalize"
                          >
                            {item.support_type}
                          </Badge>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <Badge 
                            variant={
                              item.priority === 'critical' || item.priority === 'high' 
                                ? 'destructive' 
                                : item.priority === 'medium' 
                                ? 'default' 
                                : 'secondary'
                            }
                            className={`capitalize ${
                              item.priority === 'critical' 
                                ? 'bg-red-100 text-red-800 border-red-300' 
                                : item.priority === 'high'
                                ? 'bg-orange-100 text-orange-800 border-orange-300'
                                : item.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                : 'bg-green-100 text-green-800 border-green-300'
                            }`}
                          >
                            {item.priority}
                          </Badge>
                        </td>
                        <td className="border-r border-border/30 px-6 py-4 text-center">
                          <Select
                            value={item.status}
                            onValueChange={(value) => handleStatusUpdate(item.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <Badge 
                                variant={
                                  item.status === 'resolved' 
                                    ? 'default' 
                                    : item.status === 'in_progress'
                                    ? 'secondary' 
                                    : 'destructive'
                                }
                                className={`border-0 capitalize ${
                                  item.status === 'resolved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : item.status === 'in_progress'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : item.status === 'open'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {item.status.replace('_', ' ')}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              {statusTypes.map((status) => (
                                <SelectItem key={status} value={status} className="capitalize">
                                  {status.replace('_', ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm">
                            <p className="text-foreground font-medium">
                              {new Date(item.created_date).toLocaleDateString()}
                            </p>
                            <p className="text-muted-foreground">
                              {new Date(item.created_date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                            {item.resolved_date && (
                              <p className="text-green-600 text-xs">
                                Resolved: {new Date(item.resolved_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
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
                      <HeadphonesIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No support tickets found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || filterType !== "all" || filterStatus !== "all" || filterPriority !== "all"
                          ? "Try adjusting your search or filter criteria" 
                          : "Start by creating your first support ticket"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewFranchiseSupportContent;