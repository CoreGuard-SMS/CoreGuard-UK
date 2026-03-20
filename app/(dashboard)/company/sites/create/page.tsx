"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, X } from "lucide-react";
import { generateSitePin, createSite } from "@/lib/services/site-service-client";
import { useAuth } from "@/hooks/use-auth";

export default function CreateSitePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sitePin, setSitePin] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSitePin(generateSitePin());
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactName: "",
    contactPhone: "",
    requirements: "",
  });
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");

  const handleGeneratePin = () => {
    setSitePin(generateSitePin());
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const removeRequirement = (requirement: string) => {
    setRequirements(requirements.filter(req => req !== requirement));
  };

  const handleRequirementKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRequirement();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const siteData = {
        name: formData.name,
        address: formData.address,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        sitePin: sitePin,
        organisationId: user?.organisationId,
        status: 'active',
        requirements: { requiredTraining: requirements, requiredLicences: [] }
      };

      const result = await createSite(siteData);
      
      if (result) {
        console.log("Site created successfully:", result);
        router.push("/company/sites");
      } else {
        console.error("Failed to create site - no result returned");
        // You could add a toast notification here
      }
    } catch (error) {
      console.error("Error creating site:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/company/sites">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sites
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Site</h1>
        <p className="text-muted-foreground">
          Add a new location to your organisation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the site details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                placeholder="Downtown Office Complex"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="123 Main St, Downtown, NY 10001"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="John Doe"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  placeholder="+1-555-0000"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Access PIN</CardTitle>
            <CardDescription>
              This PIN will be required for employees to access this site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Site PIN</p>
                  <p className="text-3xl font-bold tracking-wider">
                  {mounted ? sitePin : "----"}
                </p>
                </div>
              </div>
              <Button type="button" variant="outline" onClick={handleGeneratePin}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Employees will need to enter this PIN to access the site. You can regenerate it anytime.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>
              Specify training and licence requirements for smart scheduling compatibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Required Training & Licences</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Basic Security Training"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={handleRequirementKeyPress}
                  className="flex-1"
                />
                <Button type="button" onClick={addRequirement} disabled={!newRequirement.trim()}>
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter each requirement individually for smart scheduling compatibility
              </p>
            </div>
            
            {requirements.length > 0 && (
              <div className="space-y-2">
                <Label>Current Requirements ({requirements.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {requirements.map((requirement, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                    >
                      {requirement}
                      <button
                        type="button"
                        onClick={() => removeRequirement(requirement)}
                        className="ml-1 hover:bg-primary/80 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Smart Scheduling Benefits:</strong>
              </p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• Automatically match employees with required certifications</li>
                <li>• Prevent scheduling of unqualified staff</li>
                <li>• Track compliance requirements per site</li>
                <li>• Generate compliance reports</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Creating..." : "Create Site"}
          </Button>
          <Link href="/company/sites">
            <Button type="button" variant="outline" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
