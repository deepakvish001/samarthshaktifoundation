import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, RefreshCw, User, Mail, Phone, Lock, Shield, Eye, EyeOff } from "lucide-react";

const EditProfileContent = () => {
  const { user, profile, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    retypePassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      if (user && profile) {
        setFormData({
          fullName: profile.full_name || "",
          phone: profile.phone || "",
          email: user.email || "",
          password: "",
          retypePassword: ""
        });
      }
      setInitialLoading(false);
    };

    loadProfileData();
  }, [user, profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (formData.password && formData.password !== formData.retypePassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleUpdateData = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Update profile data
      const profileData = {
        full_name: formData.fullName,
        phone: formData.phone
      };

      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .update(profileData)
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      // Update email if changed
      if (formData.email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });
        if (emailError) throw emailError;
      }

      // Update password if provided
      if (formData.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password
        });
        if (passwordError) throw passwordError;
        
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          password: "",
          retypePassword: ""
        }));
      }

      // Update local auth context
      await updateProfile(profileData);
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        phone: profile.phone || "",
        email: user?.email || "",
        password: "",
        retypePassword: ""
      });
      toast.info("Form reset to original values");
    }
  };

  const handleRefresh = async () => {
    setInitialLoading(true);
    try {
      const { data: profileData, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (profileData) {
        setFormData({
          fullName: profileData.full_name || "",
          phone: profileData.phone || "",
          email: user?.email || "",
          password: "",
          retypePassword: ""
        });
      }
      
      toast.success("Profile data refreshed!");
    } catch (error: any) {
      toast.error("Failed to refresh profile data");
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
        <div className="w-full max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading profile data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Edit Profile</h1>
              <p className="text-primary-foreground/80">Update your personal information and account settings</p>
            </div>
          </div>
        </div>

        {/* Enhanced Profile Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Profile Settings
                  </span>
                  <p className="text-sm text-muted-foreground font-normal">Manage your account information securely</p>
                </div>
              </CardTitle>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-2 hover:bg-accent/50 px-4 py-2 h-10 hover-scale"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Refresh</span>
              </Button>
            </div>
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
                  {/* Full Name */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Full Name
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                      placeholder="Enter your full name"
                    />
                    <div className="text-xs text-muted-foreground">This will be displayed on your profile</div>
                  </div>

                  {/* Phone */}
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

              {/* Account Security Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-green-500/20 to-transparent">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Account Security</h3>
                </div>

                <div className="space-y-6">
                  {/* Email */}
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
                    <div className="text-xs text-muted-foreground">Changes to email will require verification</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password */}
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-12 pr-12 border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent/50"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">Leave blank to keep current password</div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.retypePassword}
                          onChange={(e) => handleInputChange('retypePassword', e.target.value)}
                          className="pl-12 pr-12 border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent/50"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex items-center justify-between pt-8 border-t-2 border-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  All changes are saved securely and immediately
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={loading}
                    className="border-2 hover:bg-accent/50 px-6 py-3 h-12 hover-scale"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Form
                  </Button>
                  
                  <Button
                    onClick={handleUpdateData}
                    disabled={loading}
                    className="bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 h-12 shadow-lg hover-scale"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfileContent;