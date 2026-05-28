import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Trash2, Loader2, Search, Mail, Users, Calendar, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";

interface ContactUs {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at?: string;
}

const ContactUsContent = () => {
  const {
    data: contacts,
    loading,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<ContactUs>({ tableName: 'contact_us' });

  useAdminRealTime({
    tableName: 'contact_us'
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Filtered contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.phone && contact.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate statistics
  const totalContacts = contacts.length;
  const recentContacts = contacts.filter(contact => {
    if (!contact.created_at) return false;
    const contactDate = new Date(contact.created_at);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return contactDate >= threeDaysAgo;
  }).length;
  const todayContacts = contacts.filter(contact => {
    if (!contact.created_at) return false;
    const contactDate = new Date(contact.created_at);
    const today = new Date();
    return contactDate.toDateString() === today.toDateString();
  }).length;
  const contactsWithPhone = contacts.filter(contact => contact.phone && contact.phone.trim() !== "").length;

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success("Contact deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  if (loading) {
    return (
      <Card className="border-0 bg-card/90 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading contacts...</p>
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
                <p className="text-primary-foreground/80 text-sm font-medium">Total Contacts</p>
                <p className="text-3xl font-bold">{totalContacts}</p>
              </div>
              <div className="p-3 bg-primary-foreground/20 rounded-full">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm font-medium">Today's Contacts</p>
                <p className="text-3xl font-bold">{todayContacts}</p>
              </div>
              <div className="p-3 bg-accent-foreground/20 rounded-full">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-foreground/80 text-sm font-medium">Recent Contacts</p>
                <p className="text-3xl font-bold">{recentContacts}</p>
              </div>
              <div className="p-3 bg-secondary-foreground/20 rounded-full">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground/80 text-sm font-medium">With Phone</p>
                <p className="text-3xl font-bold text-foreground">{contactsWithPhone}</p>
              </div>
              <div className="p-3 bg-muted-foreground/20 rounded-full">
                <Phone className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Contacts Table */}
      <Card className="border-0 bg-card/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-xl font-bold flex items-center space-x-3">
              <div className="p-2 bg-primary-foreground/20 rounded-lg">
                <Phone className="h-5 w-5" />
              </div>
              <span>Contact Management ({filteredContacts.length} items)</span>
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/90 border-primary-foreground/20 focus:border-primary-foreground focus:ring-primary-foreground/20"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredContacts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                 <TableHeader>
                   <TableRow className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary">
                     <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Name</TableHead>
                     <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Email</TableHead>
                     <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Phone</TableHead>
                     <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Message</TableHead>
                     <TableHead className="text-primary-foreground font-bold text-center py-4 border-r border-primary-foreground/20">Date</TableHead>
                     <TableHead className="text-primary-foreground font-bold text-center py-4">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredContacts.map((contact, index) => (
                     <TableRow key={contact.id} className={`${index % 2 === 0 ? "bg-muted/30" : "bg-background"} hover:bg-muted/50 transition-colors`}>
                       <TableCell className="text-center p-4 border-r border-border/50">
                         <div className="flex items-center justify-center space-x-2">
                           <Users className="h-4 w-4 text-primary" />
                           <span className="font-medium text-foreground">{contact.name}</span>
                         </div>
                       </TableCell>
                       <TableCell className="text-center p-4 border-r border-border/50">
                         <div className="flex items-center justify-center space-x-2">
                           <Mail className="h-4 w-4 text-accent" />
                           <span className="text-foreground">{contact.email}</span>
                         </div>
                       </TableCell>
                       <TableCell className="text-center p-4 border-r border-border/50">
                         <div className="flex items-center justify-center space-x-2">
                           <Phone className="h-4 w-4 text-secondary" />
                           <span className="text-foreground">{contact.phone || "-"}</span>
                         </div>
                       </TableCell>
                       <TableCell className="text-center p-4 border-r border-border/50">
                         <div className="flex items-center justify-center space-x-2">
                           <MessageSquare className="h-4 w-4 text-muted-foreground" />
                           <span className="text-foreground max-w-xs truncate">{contact.message}</span>
                         </div>
                       </TableCell>
                       <TableCell className="text-center p-4 border-r border-border/50">
                         <div className="flex items-center justify-center space-x-2">
                           <Calendar className="h-4 w-4 text-primary" />
                           <span className="text-foreground text-sm">
                             {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : "-"}
                           </span>
                         </div>
                       </TableCell>
                       <TableCell className="text-center p-4">
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleDelete(contact.id)}
                           className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 min-h-[400px] bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                {searchTerm ? (
                  <>
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No contacts found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </>
                ) : (
                  <>
                    <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No contacts yet</p>
                    <p className="text-sm">Contact messages will appear here</p>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUsContent;