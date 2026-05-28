import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Loader2, User, Lock, Mail, Phone, Camera, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name || '');
    setPhone(profile?.phone || '');
    setAvatarUrl(profile?.avatar_url || '');
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({ full_name: fullName, phone, avatar_url: avatarUrl });
    setSaving(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast({ title: 'Invalid file type', description: 'Please upload a JPG or PNG image.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum size is 5MB.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, cacheControl: '3600' });
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(publicUrl);
      await updateProfile({ avatar_url: publicUrl });
      toast({ title: 'Avatar updated', description: 'Your profile picture has been saved.' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      toast({ title: 'Password too short', description: 'Use at least 8 characters.', variant: 'destructive' });
      return;
    }
    setChangingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPwd(false);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated', description: 'Your password has been changed.' });
      setNewPassword('');
    }
  };

  const initials = (fullName || user?.email || 'U').slice(0, 2).toUpperCase();
  const pwdStrength = newPassword.length === 0 ? 0
    : newPassword.length < 8 ? 1
    : newPassword.length < 12 ? 2
    : /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword) ? 4 : 3;
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-muted', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and security</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-grid">
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
            <TabsTrigger value="security" className="gap-2"><Lock className="h-4 w-4" /> Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-0">
            {/* Avatar card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile picture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 ring-4 ring-background shadow-md">
                      <AvatarImage src={avatarUrl} alt={fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform disabled:opacity-50"
                      aria-label="Upload photo"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                      {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      {uploading ? 'Uploading...' : 'Upload new photo'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center sm:justify-start gap-1">
                      <AlertCircle className="h-3 w-3" /> JPG or PNG, max 5MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal info card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personal information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" value={user?.email || ''} disabled className="pl-9 bg-muted/50" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs uppercase tracking-wide text-muted-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-wide text-muted-foreground">Phone</Label>
                    <div className="relative">
                      <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99999 99999" className="pl-9" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t">
                  <Button onClick={handleSave} disabled={saving} className="min-w-[140px]">
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : <><Check className="h-4 w-4 mr-2" /> Save changes</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Change password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="newPwd" className="text-xs uppercase tracking-wide text-muted-foreground">New password</Label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="newPwd"
                      type={showPwd ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {newPassword.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${i <= pwdStrength ? strengthColors[pwdStrength] : 'bg-muted'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Strength: <span className="font-medium text-foreground">{strengthLabels[pwdStrength]}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="rounded-md bg-muted/50 border p-3 text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">For a strong password:</p>
                  <p>• Use at least 12 characters</p>
                  <p>• Mix uppercase, lowercase, numbers & symbols</p>
                  <p>• Avoid common words or patterns</p>
                </div>
                <div className="flex justify-end pt-2 border-t">
                  <Button onClick={handlePasswordChange} disabled={changingPwd || !newPassword} className="min-w-[160px]">
                    {changingPwd ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</> : 'Update password'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;