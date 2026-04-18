import { Layout } from "@/components/layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Calendar, Loader2, ShieldCheck, Leaf, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/image-upload";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, location, avatarUrl }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const updated = await res.json();
      updateUser(updated);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch {
      toast({ title: "Save failed", description: "Could not update your profile. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const isFarmer = user.role === "farmer";

  return (
    <Layout>
      <div className="bg-primary/5 py-10 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground tracking-tight">Account & Identity</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-xl">Manage your public presence in the AgriConnect network.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Identity Card (Left Col) */}
          <div className="md:col-span-1 space-y-8">
            <Card className="rounded-3xl border-border/60 shadow-sm overflow-hidden bg-card">
              <div className="h-32 bg-gradient-to-br from-primary to-primary/80 relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent pointer-events-none" />
              </div>
              <CardContent className="px-6 pb-8 pt-0 flex flex-col items-center text-center relative">
                <div className="-mt-16 mb-4 relative group">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground font-serif font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="w-full mb-6 text-left">
                  <ImageUpload
                    value={avatarUrl || null}
                    onChange={(url) => setAvatarUrl(url)}
                    onClear={() => setAvatarUrl("")}
                    folder="avatars"
                    aspectRatio="square"
                    label="Change Photo"
                  />
                </div>

                <h2 className="text-2xl font-bold font-serif text-foreground leading-tight">{user.name}</h2>
                <Badge className="mt-3 mb-6 px-4 py-1.5 uppercase tracking-wider text-xs font-bold bg-secondary text-secondary-foreground hover:bg-secondary border-none shadow-sm">
                  {user.role} Account
                </Badge>
                
                <div className="w-full space-y-4 text-left border-t border-border/50 pt-6">
                  <div className="flex items-center text-[15px] text-foreground">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 shrink-0">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-[15px] text-foreground">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 shrink-0">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="truncate">{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center text-[15px] text-foreground">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 shrink-0">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="truncate">{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-[15px] text-foreground">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 shrink-0">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span>Joined {format(new Date(user.createdAt), 'MMM yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-secondary/20 shadow-sm bg-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="h-6 w-6 text-secondary" />
                  <h3 className="font-bold text-foreground">Verified Member</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your identity has been verified in the AgriConnect network, building trust with potential {isFarmer ? 'buyers' : 'growers'}.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Form Content (Right Col) */}
          <div className="md:col-span-2 space-y-8">
            <Card className="rounded-3xl border-border/60 shadow-sm overflow-hidden">
              <div className="bg-muted/30 px-8 py-6 border-b border-border/60 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-serif text-foreground">Business Details</h2>
                  <p className="text-sm text-muted-foreground">This information is shared with contracted partners.</p>
                </div>
              </div>
              
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name" className="text-base font-medium">Business / Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 bg-muted/30 border-border text-base" />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="text-base font-medium">Account Email</Label>
                    <Input id="email" defaultValue={user.email} disabled className="h-12 bg-muted/50 border-border/50 text-base text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed directly. Contact support.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium">Contact Number</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Primary contact number" className="h-12 bg-muted/30 border-border text-base" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-base font-medium">Primary Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Region, Country" className="h-12 bg-muted/30 border-border text-base" />
                  </div>
                </div>
                
                <div className="pt-8 border-t border-border/50 flex justify-end">
                  <Button onClick={handleSave} disabled={saving} size="lg" className="rounded-full px-10 shadow-lg shadow-primary/20">
                    {saving && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Save Profile Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/60 shadow-sm overflow-hidden">
              <div className="bg-muted/30 px-8 py-6 border-b border-border/60">
                <h2 className="text-xl font-bold font-serif text-foreground">Platform Preferences</h2>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-foreground mb-1">Communication Alerts</h4>
                      <p className="text-sm text-muted-foreground">Get notified when partners send you a direct message or propose a contract.</p>
                    </div>
                    <Button variant="outline" className="rounded-full shrink-0">Configure</Button>
                  </div>
                  <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-foreground mb-1">Security Settings</h4>
                      <p className="text-sm text-muted-foreground">Manage your password, connected devices, and two-factor authentication.</p>
                    </div>
                    <Button variant="outline" className="rounded-full shrink-0 border-border">Security Dashboard</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
