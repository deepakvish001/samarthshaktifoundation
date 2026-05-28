import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle, Loader2, Shield, Lock, Key, UserCheck, AlertTriangle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ChangePasswordContent = () => {
  const { user } = useAuth();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return false;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("New password must be different from current password");
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // First verify current password by trying to sign in with it
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: formData.currentPassword
      });

      if (verifyError) {
        toast.error("Current password is incorrect");
        return;
      }

      // Update password in Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (updateError) {
        throw updateError;
      }

      // Success
      setIsSuccess(true);
      toast.success("Password changed successfully!");
      
      // Clear form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Log the password change activity
      try {
        await (supabase as any)
          .from('notifications')
          .insert({
            user_id: user?.id,
            title: 'Password Changed',
            message: 'Your password was successfully updated for security.',
            type: 'security'
          });
      } catch (notificationError) {
        console.error('Failed to log password change:', notificationError);
      }

    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsSuccess(false);
    toast.info("Form reset");
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 25, label: "Too Short", color: "bg-red-500" };
    if (password.length < 8) return { strength: 50, label: "Weak", color: "bg-orange-500" };
    if (password.length < 12) return { strength: 75, label: "Good", color: "bg-yellow-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-6">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Change Login Password</h1>
              <p className="text-primary-foreground/80">Update your password to keep your account secure</p>
            </div>
          </div>
        </div>

        {/* Enhanced Password Change Form */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm animate-scale-in">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
                <Key className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Password Security Update
                </span>
                <p className="text-sm text-muted-foreground font-normal">Secure your account with a strong new password</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {isSuccess ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-4">
                  Password Changed Successfully!
                </h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Your password has been updated successfully. Please use your new password for future logins.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={() => setIsSuccess(false)}
                    className="bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 h-12 shadow-lg hover-scale"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Change Another Password
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Current Password Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-blue-500/20 to-transparent">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                      <UserCheck className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Current Authentication</h3>
                    <div className="ml-auto">
                      <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">Required</div>
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        type={showPasswords.current ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        className="pl-12 pr-12 border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                        placeholder="Enter your current password"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent/50"
                        onClick={() => togglePasswordVisibility('current')}
                        disabled={loading}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">Verify your identity to proceed</div>
                  </div>
                </div>

                {/* New Password Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-green-500/20 to-transparent">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                      <Key className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">New Password Setup</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          type={showPasswords.new ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          className="pl-12 pr-12 border-2 border-border/80 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 group-hover:border-primary/50 shadow-sm"
                          placeholder="Enter your new password"
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent/50"
                          onClick={() => togglePasswordVisibility('new')}
                          disabled={loading}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      {/* Enhanced Password Strength Indicator */}
                      {formData.newPassword && (
                        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">Password Strength</span>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${passwordStrength.strength >= 75 ? 'bg-green-100 text-green-700' : passwordStrength.strength >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3 shadow-inner">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 shadow-sm ${passwordStrength.color}`}
                              style={{ width: `${passwordStrength.strength}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`pl-12 pr-12 border-2 bg-background focus:ring-2 transition-all h-12 group-hover:border-primary/50 shadow-sm ${
                            formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                              : 'border-border/80 focus:border-primary focus:ring-primary/20'
                          }`}
                          placeholder="Confirm your new password"
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent/50"
                          onClick={() => togglePasswordVisibility('confirm')}
                          disabled={loading}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Passwords do not match</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Password Requirements */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-orange-500/20 to-transparent">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Security Requirements</h3>
                  </div>

                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
                    <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Password Security Checklist:
                    </h4>
                    <div className="space-y-3">
                      <div className={`flex items-center gap-3 text-sm transition-colors duration-300 ${formData.newPassword.length >= 6 ? "text-green-600" : "text-muted-foreground"}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${formData.newPassword.length >= 6 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                          {formData.newPassword.length >= 6 ? "✓" : "•"}
                        </div>
                        <span>Minimum 6 characters long</span>
                      </div>
                      <div className={`flex items-center gap-3 text-sm transition-colors duration-300 ${formData.currentPassword !== formData.newPassword && formData.newPassword ? "text-green-600" : "text-muted-foreground"}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${formData.currentPassword !== formData.newPassword && formData.newPassword ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                          {formData.currentPassword !== formData.newPassword && formData.newPassword ? "✓" : "•"}
                        </div>
                        <span>Must not match current password</span>
                      </div>
                      <div className={`flex items-center gap-3 text-sm transition-colors duration-300 ${formData.newPassword === formData.confirmPassword && formData.confirmPassword ? "text-green-600" : "text-muted-foreground"}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${formData.newPassword === formData.confirmPassword && formData.confirmPassword ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                          {formData.newPassword === formData.confirmPassword && formData.confirmPassword ? "✓" : "•"}
                        </div>
                        <span>New password and confirm password must match</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex items-center justify-between pt-8 border-t-2 border-gradient-to-r from-primary/10 to-transparent">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Your password will be encrypted and stored securely
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
                      onClick={handleChangePassword}
                      disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                      className="bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 h-12 shadow-lg hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 mr-2" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordContent;