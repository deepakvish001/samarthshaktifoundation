import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { Loader2, Building2, CheckCircle, Clock, Calendar, Search, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { AdminPresenceIndicator } from "./AdminPresenceIndicator";
import { useState } from "react";

interface FranchiseRegistration {
  id: string;
  institute_full_name: string;
  institute_sort_name: string;
  centre_head_name: string;
  email: string;
  mobile_number: string;
  state_name: string;
  district_name: string;
  postal_address: string;
  pin_code: string;
  approval_status: string;
  status: string;
  date_of_registration: string;
  franchise_type: string;
  year_of_establishment: string;
  created_at: string;
  updated_at: string;
}

const FranchiseApprovalContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { 
    data: franchiseData, 
    loading, 
    update,
    delete: deleteItem,
    create,
    refresh 
  } = useOptimisticCrud<FranchiseRegistration>({
    tableName: 'franchise_registrations',
    orderBy: { column: 'created_at', ascending: false }
  });

  // Enable real-time updates
  useAdminRealTime({
    tableName: 'franchise_registrations'
  });

  // Statistics calculations
  const totalFranchises = franchiseData.length;
  const approvedFranchises = franchiseData.filter(f => f.approval_status === 'approved').length;
  const pendingFranchises = franchiseData.filter(f => f.approval_status === 'pending').length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonthFranchises = franchiseData.filter(f => 
    f.created_at && f.created_at.slice(0, 7) === currentMonth
  ).length;

  // Filter franchises based on search term
  const filteredFranchises = franchiseData.filter(franchise =>
    franchise.institute_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    franchise.centre_head_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    franchise.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    franchise.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    franchise.district_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprovalToggle = async (franchise: FranchiseRegistration) => {
    try {
      const newApprovalStatus = franchise.approval_status === 'approved' ? 'pending' : 'approved';
      await update(franchise.id, {
        ...franchise,
        approval_status: newApprovalStatus,
        status: newApprovalStatus === 'approved' ? 'active' : 'pending'
      });
      toast.success(`Franchise ${newApprovalStatus === 'approved' ? 'approved' : 'marked as pending'} successfully!`);
    } catch (error) {
      toast.error('Failed to update franchise approval status');
    }
  };

  if (loading) {
    return (
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading franchise registrations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <span>Management of Franchise</span>
        </h1>
        <AdminPresenceIndicator />
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold">{totalFranchises}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold">{approvedFranchises}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-foreground/80 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold">{pendingFranchises}</p>
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
                <p className="text-3xl font-bold text-foreground">{thisMonthFranchises}</p>
              </div>
              <div className="p-3 bg-background/20 rounded-full">
                <Calendar className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-elegant border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <CardTitle className="text-xl font-bold flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-background/20 rounded-lg">
                <Building2 className="h-5 w-5" />
              </div>
              <span>Franchise Applications</span>
            </div>
            <Badge className="bg-background/20 text-primary-foreground border-background/30">
              Shown: {filteredFranchises.length}
            </Badge>
          </CardTitle>
        </CardHeader>

        <div className="px-6 pt-4">
          <div className="flex justify-end mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search franchises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border/40 bg-background focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary/30">Approval</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-left py-4 border-r border-primary/30">Institute Details</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-left py-4 border-r border-primary/30">Contact Info</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-left py-4 border-r border-primary/30">Location</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-left py-4 border-r border-primary/30">Type & Date</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFranchises.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No matching franchises found' : 'No franchise applications found'}
                      {searchTerm && (
                        <div className="mt-4">
                          <Button variant="outline" onClick={() => setSearchTerm('')} className="border-border/40 hover:bg-accent/20">
                            Clear Search
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFranchises.map((franchise, index) => (
                    <TableRow 
                      key={franchise.id} 
                      className={`${index % 2 === 0 ? "bg-accent/10" : "bg-background"} hover:bg-accent/20 transition-colors`}
                    >
                      <TableCell className="text-center p-4 border-r border-border">
                        <div className="flex flex-col items-center space-y-2">
                          <Checkbox 
                            checked={franchise.approval_status === 'approved'} 
                            onCheckedChange={() => handleApprovalToggle(franchise)}
                          />
                          <Button
                            variant={franchise.approval_status === 'approved' ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => handleApprovalToggle(franchise)}
                            className="text-xs h-7"
                          >
                            {franchise.approval_status === 'approved' ? 'Revoke' : 'Approve'}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 border-r border-border">
                        <div className="space-y-1">
                          <div className="font-medium text-sm text-foreground">{franchise.institute_full_name}</div>
                          <div className="text-xs text-muted-foreground">Head: {franchise.centre_head_name}</div>
                          <div className="text-xs text-muted-foreground">Short: {franchise.institute_sort_name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 border-r border-border">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-foreground">
                            <Mail className="h-4 w-4 text-accent mr-2" />
                            {franchise.email}
                          </div>
                          <div className="flex items-center text-foreground">
                            <Phone className="h-4 w-4 text-secondary mr-2" />
                            {franchise.mobile_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 border-r border-border">
                        <div className="space-y-1 text-sm">
                          <div className="font-medium text-foreground">{franchise.state_name}</div>
                          <div className="text-muted-foreground">{franchise.district_name}</div>
                          <div className="text-xs text-muted-foreground">{franchise.pin_code}</div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 border-r border-border">
                        <div className="space-y-1 text-sm">
                          <div className="font-medium text-foreground">{franchise.franchise_type}</div>
                          <div className="text-muted-foreground">Est: {franchise.year_of_establishment}</div>
                          <div className="text-xs text-muted-foreground">
                            {franchise.date_of_registration ? new Date(franchise.date_of_registration).toLocaleDateString() : "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            franchise.approval_status === 'approved'
                              ? 'bg-accent/20 text-accent-foreground'
                              : franchise.approval_status === 'rejected'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-secondary/20 text-secondary-foreground'
                          }`}
                        >
                          {franchise.approval_status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FranchiseApprovalContent;