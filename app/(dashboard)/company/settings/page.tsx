"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, RefreshCw, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { updateOrganisation, regenerateOrganisationPin } from "@/lib/actions/organisation";
import { getOrganisationByUserId } from "@/lib/actions/organisation";
import { useAuth } from "@/hooks/use-auth";

export default function SettingsPage() {
  const { user } = useAuth();
  const [organisation, setOrganisation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    console.log("User data in settings:", user);
    if (user) {
      fetchOrganisation();
    }
  }, [user]);

  const fetchOrganisation = async () => {
    try {
      console.log("Fetching organisation for user:", user);
      const orgData = await getOrganisationByUserId(user.id);
      console.log("Fetched organisation data:", orgData);
      setOrganisation(orgData);
    } catch (error) {
      console.error("Error fetching organisation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrganisation = async (formData: FormData) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateOrganisation(organisation.id, {
        name: formData.get("name") as string,
        industry: formData.get("industry") as string,
        contact_email: formData.get("contact_email") as string,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("Organisation updated successfully");
        await fetchOrganisation(); // Refresh data
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleRegeneratePin = async () => {
    if (!confirm("Are you sure you want to regenerate the PIN? This will invalidate the current PIN.")) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await regenerateOrganisationPin(organisation.id);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("PIN regenerated successfully");
        await fetchOrganisation(); // Refresh data
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("PIN copied to clipboard");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Failed to copy to clipboard");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!organisation) {
    return <div>Organisation not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organisation settings and preferences
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
          {success}
        </div>
      )}

      <Tabs defaultValue="organisation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organisation">Organisation</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="organisation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organisation Profile</CardTitle>
              <CardDescription>Update your organisation information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveOrganisation(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organisation Name</Label>
                  <Input id="name" name="name" defaultValue={organisation.name} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" name="industry" defaultValue={organisation.industry} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input id="contact_email" name="contact_email" type="email" defaultValue={organisation.contact_email} required />
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organisation PIN</CardTitle>
              <CardDescription>
                Share this PIN with employees to join your organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Your Organisation PIN</p>
                    <p className="text-4xl font-bold tracking-wider">{organisation.organisation_pin}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => copyToClipboard(organisation.organisation_pin)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy PIN
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleRegeneratePin} disabled={saving}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Regenerating the PIN will invalidate the old one. Employees using the old PIN will no longer be able to join.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage administrator access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{user?.name || user?.email}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Badge>Owner</Badge>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Invite Admin
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notification settings coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
