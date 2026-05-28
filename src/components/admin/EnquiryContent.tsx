import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HelpCircle, Trash2, Loader2, Search, Users, Calendar, MapPin, Building, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface Enquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  state: string;
  city?: string;
  organization?: string;
  address?: string;
}

const EnquiryContent = () => {
  const {
    data: enquiries,
    loading,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<Enquiry>({ tableName: 'enquiries' });

  useAdminRealTime({
    tableName: 'enquiries'
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Filtered enquiries based on search
  const filteredEnquiries = enquiries.filter(enquiry =>
    enquiry.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (enquiry.city && enquiry.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (enquiry.organization && enquiry.organization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate statistics
  const totalEnquiries = enquiries.length;
  const recentEnquiries = enquiries.slice(-5).length; // Last 5 enquiries
  const enquiriesWithOrganizations = enquiries.filter(enquiry => enquiry.organization && enquiry.organization.trim() !== "").length;
  const uniqueStates = [...new Set(enquiries.map(enquiry => enquiry.state))].length;

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Enquiry deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete enquiry");
    }
  };

  if (loading) {
    return (
      <Card className="border-0 bg-card/90 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading enquiries...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Total Enquiries</p>
                <p className="text-3xl font-bold">{totalEnquiries}</p>
              </div>
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <HelpCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm font-medium">Unique States</p>
                <p className="text-3xl font-bold">{uniqueStates}</p>
              </div>
              <div className="p-3 bg-accent-foreground/20 rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-foreground/80 text-sm font-medium">With Organizations</p>
                <p className="text-3xl font-bold">{enquiriesWithOrganizations}</p>
              </div>
              <div className="p-3 bg-secondary-foreground/20 rounded-full">
                <Building className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground/80 text-sm font-medium">Recent Enquiries</p>
                <p className="text-3xl font-bold text-foreground">{recentEnquiries}</p>
              </div>
              <div className="p-3 bg-muted-foreground/20 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Enquiry Table */}
      <Card className="border-0 bg-card/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-primary-foreground/20 rounded-lg">
                <HelpCircle className="h-5 w-5" />
              </div>
              <span>Enquiry Management ({filteredEnquiries.length} items)</span>
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/90 border-primary-foreground/20 focus:border-primary-foreground focus:ring-primary-foreground/20"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary">
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Name</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Email</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Phone</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Location</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Organization</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Address</TableHead>
                  <TableHead className="text-primary-foreground font-bold text-center py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No enquiries found matching your search." : "No enquiries submitted yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnquiries.map((enquiry, index) => (
                    <TableRow key={enquiry.id} className={`${index % 2 === 0 ? "bg-muted/30" : "bg-background"} hover:bg-muted/50 transition-colors`}>
                      <TableCell className="p-4 border-r border-border/50">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">
                            {enquiry.first_name} {enquiry.last_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="flex items-center justify-center space-x-2">
                          <Mail className="h-4 w-4 text-accent" />
                          <span className="text-foreground">{enquiry.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="flex items-center justify-center space-x-2">
                          <Phone className="h-4 w-4 text-secondary" />
                          <span className="text-foreground">{enquiry.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="flex items-center justify-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {enquiry.city ? `${enquiry.city}, ${enquiry.state}` : enquiry.state}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <div className="flex items-center justify-center space-x-2">
                          <Building className="h-4 w-4 text-accent" />
                          <span className="text-foreground">{enquiry.organization || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-4 border-r border-border/50">
                        <span className="text-foreground max-w-xs truncate block">
                          {enquiry.address || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(enquiry.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-3 rounded-lg text-primary-foreground font-medium shadow-lg">
          Page {Math.ceil(filteredEnquiries.length / 10) || 1}
        </div>
      </div>
    </div>
  );
};

export default EnquiryContent;