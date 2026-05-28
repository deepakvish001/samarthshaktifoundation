import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Edit, Trash2, Loader2, Plus, Settings, Eye, Shield, Mail, Phone, Building, Users, Activity, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { useOptimisticCrud } from "@/hooks/useOptimisticCrud";
import { useAuth } from "@/contexts/AuthContext";

interface AdminProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  designation?: string;
  department?: string;
  profile_image_url?: string;
  bio?: string;
  permissions: any;
  last_login?: string;
  is_active: boolean;
}

const AdminProfileManagementContent = () => {
  const { user } = useAuth();
  const {
    data: adminProfiles,
    loading,
    create,
    update,
    delete: deleteItem,
    refresh
  } = useOptimisticCrud<AdminProfile>({ 
    tableName: 'admin_profiles',
    orderBy: { column: 'full_name', ascending: true }
  });

  useAdminRealTime({
    tableName: 'admin_profiles'
  });

  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    bio: "",
    permissions: "",
    isActive: true
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPermissions, setShowPermissions] = useState<string | null>(null);

  // Load current user data if editing own profile
  useEffect(() => {
    if (user && !editingId) {
      const currentUserProfile = adminProfiles.find(profile => profile.user_id === user.id);
      if (currentUserProfile) {
        setFormData({
          userId: currentUserProfile.user_id,
          fullName: currentUserProfile.full_name,
          email: currentUserProfile.email,
          phone: currentUserProfile.phone || "",
          designation: currentUserProfile.designation || "",
          department: currentUserProfile.department || "",
          bio: currentUserProfile.bio || "",
          permissions: currentUserProfile.permissions ? JSON.stringify(currentUserProfile.permissions, null, 2) : "",
          isActive: currentUserProfile.is_active
        });
      }
    }
  }, [user, adminProfiles, editingId]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Please enter full name and email");
      return;
    }

    let permissionsJson = {};
    if (formData.permissions.trim()) {
      try {
        permissionsJson = JSON.parse(formData.permissions);
      } catch (error) {
        toast.error("Invalid JSON format for permissions");
        return;
      }
    }

    try {
      const profileData = {
        user_id: formData.userId || user?.id || "",
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        designation: formData.designation || null,
        department: formData.department || null,
        bio: formData.bio || null,
        permissions: permissionsJson,
        is_active: formData.isActive,
        last_login: new Date().toISOString()
      };

      if (editingId) {
        await update(editingId, profileData);
        toast.success("Admin profile updated successfully!");
        setEditingId(null);
      } else {
        await create(profileData);
        toast.success("Admin profile created successfully!");
      }

      // Reset form
      setFormData({
        userId: "",
        fullName: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        bio: "",
        permissions: "",
        isActive: true
      });
    } catch (error) {
      toast.error(editingId ? "Failed to update admin profile" : "Failed to create admin profile");
    }
  };

  const handleEdit = (profile: AdminProfile) => {
    setFormData({
      userId: profile.user_id,
      fullName: profile.full_name,
      email: profile.email,
      phone: profile.phone || "",
      designation: profile.designation || "",
      department: profile.department || "",
      bio: profile.bio || "",
      permissions: profile.permissions ? JSON.stringify(profile.permissions, null, 2) : "",
      isActive: profile.is_active
    });
    setEditingId(profile.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      userId: "",
      fullName: "",
      email: "",
      phone: "",
      designation: "",
      department: "",
      bio: "",
      permissions: "",
      isActive: true
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin profile?")) return;
    
    try {
      await deleteItem(id);
      toast.success("Admin profile deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete admin profile");
    }
  };

  const handleToggleStatus = async (profile: AdminProfile) => {
    try {
      await update(profile.id, {
        ...profile,
        is_active: !profile.is_active
      });
      toast.success(`Admin profile ${!profile.is_active ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      toast.error("Failed to update admin profile status");
    }
  };

  const defaultPermissions = {
    "users": {
      "read": true,
      "write": true,
      "delete": false
    },
    "courses": {
      "read": true,
      "write": true,
      "delete": true
    },
    "students": {
      "read": true,
      "write": true,
      "delete": false
    },
    "finances": {
      "read": true,
      "write": false,
      "delete": false
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
        <div className="w-full max-w-6xl mx-auto">
          <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading admin profiles...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <UserCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Admin Profile Management</h1>
              <p className="text-primary-foreground/80">Manage administrator profiles and permissions</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-lg font-semibold mb-2">Total Admins</h3>
              <p className="text-blue-100 text-2xl font-bold">{adminProfiles?.length || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6 text-center">
              <Activity className="h-12 w-12 mx-auto mb-4 text-green-200" />
              <h3 className="text-lg font-semibold mb-2">Active Profiles</h3>
              <p className="text-green-100 text-2xl font-bold">{adminProfiles?.filter(p => p.is_active).length || 0}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover-scale cursor-pointer">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-purple-200" />
              <h3 className="text-lg font-semibold mb-2">Permission Sets</h3>
              <p className="text-purple-100 text-2xl font-bold">{adminProfiles?.filter(p => p.permissions && Object.keys(p.permissions).length > 0).length || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Admin Profile Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {editingId ? 'Edit Admin Profile' : 'Create Admin Profile'}
                </span>
                <p className="text-sm text-muted-foreground font-normal">
                  {editingId ? 'Update administrator information and permissions' : 'Add a new administrator to the system'}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-blue-500/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">Required</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      User ID
                    </label>
                    <Input
                      value={formData.userId}
                      onChange={(e) => handleInputChange('userId', e.target.value)}
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                      placeholder="UUID from auth.users"
                      disabled={!!editingId}
                    />
                    <div className="text-xs text-muted-foreground">System-generated identifier from authentication</div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Full Name
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                      placeholder="Enter administrator's full name"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-12 border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-12 border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Department Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-green-500/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Role & Department</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Designation
                    </label>
                    <Select value={formData.designation} onValueChange={(value) => handleInputChange('designation', value)}>
                      <SelectTrigger className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm">
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-xl">
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Coordinator">Coordinator</SelectItem>
                        <SelectItem value="Assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Department
                    </label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                      <SelectTrigger className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border shadow-xl">
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Student Affairs">Student Affairs</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Bio/Description
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="min-h-[100px] border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all group-hover:border-primary/50 shadow-sm resize-none"
                    placeholder="Enter administrator bio or description"
                  />
                </div>
              </div>

              {/* Permissions & Settings Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-orange-500/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Permissions & Settings</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Permissions (JSON)
                    </label>
                    <Textarea
                      value={formData.permissions}
                      onChange={(e) => handleInputChange('permissions', e.target.value)}
                      className="min-h-[150px] border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all group-hover:border-primary/50 shadow-sm resize-none font-mono text-sm"
                      placeholder={JSON.stringify(defaultPermissions, null, 2)}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Enter permissions as valid JSON format</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('permissions', JSON.stringify(defaultPermissions, null, 2))}
                        className="border-primary/50 text-primary hover:bg-primary/10"
                      >
                        Load Default Permissions
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Account Status
                    </label>
                    <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">
                          {formData.isActive ? 'Active Account' : 'Inactive Account'}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {formData.isActive ? 'Administrator can access the system' : 'Administrator access is disabled'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center justify-between pt-8 border-t-2 border-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  All profile changes are logged and secured
                </div>
                <div className="flex items-center gap-4">
                  {editingId && (
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="border-2 hover:bg-accent/50 px-6 py-3 h-12 hover-scale"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Edit
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 h-12 shadow-lg hover-scale"
                  >
                    {editingId ? (
                      <>
                        <Settings className="h-5 w-5 mr-2" />
                        Update Profile
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Create Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Admin Profiles Table */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm animate-fade-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Administrator Profiles
                </span>
                <p className="text-sm text-muted-foreground font-normal">Manage existing administrator accounts and permissions</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/80">
                    <TableHead className="border-2 border-border text-primary-foreground font-bold text-center py-4">Actions</TableHead>
                    <TableHead className="border-2 border-border text-primary-foreground font-bold text-center py-4">Name</TableHead>
                    <TableHead className="border-2 border-border text-primary-foreground font-bold text-center py-4">Email</TableHead>
                    <TableHead className="border-2 border-border text-primary-foreground font-bold text-center py-4">Designation</TableHead>
                    <TableHead className="border-2 border-border text-primary-foreground font-bold text-center py-4">Department</TableHead>
                    <TableHead className="border-2 border-border text-primary-foreground font-bold text-center py-4">Status</TableHead>
                    <TableHead className="border-2 border-border text-primary-foreground font-bold text-center py-4">Last Login</TableHead>
                    <TableHead className="border-2 border-border text-primary-foreground font-bold text-center py-4">Permissions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminProfiles.map((profile, index) => (
                    <TableRow key={profile.id} className={index % 2 === 0 ? "bg-card/50" : "bg-background"}>
                      <TableCell className="border-2 border-border p-4">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(profile)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 hover-scale"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(profile.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 hover-scale"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="border-2 border-border text-center p-4 text-foreground font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span>{profile.full_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="border-2 border-border text-center p-4 text-foreground font-medium">
                        {profile.email}
                      </TableCell>
                      <TableCell className="border-2 border-border text-center p-4 text-foreground font-medium">
                        {profile.designation || "-"}
                      </TableCell>
                      <TableCell className="border-2 border-border text-center p-4 text-foreground font-medium">
                        {profile.department || "-"}
                      </TableCell>
                      <TableCell className="border-2 border-border text-center p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Switch
                            checked={profile.is_active}
                            onCheckedChange={() => handleToggleStatus(profile)}
                          />
                          <span className={`text-sm font-medium ${profile.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {profile.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="border-2 border-border text-center p-4 text-foreground font-medium">
                        {profile.last_login ? new Date(profile.last_login).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell className="border-2 border-border text-center p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPermissions(showPermissions === profile.id ? null : profile.id)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 hover-scale"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {showPermissions === profile.id && (
                          <div className="absolute left-0 right-0 mt-2 mx-4 p-4 bg-background border border-border rounded-lg shadow-xl z-10 max-h-40 overflow-auto">
                            <pre className="text-xs text-foreground whitespace-pre-wrap">
                              {JSON.stringify(profile.permissions, null, 2)}
                            </pre>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfileManagementContent;