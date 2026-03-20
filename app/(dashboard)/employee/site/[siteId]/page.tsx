"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Phone, User, Shield, CheckCircle, XCircle } from "lucide-react";
import { getSiteById, validateSitePin } from "@/lib/services/site-service";

export default function EmployeeSiteDetailPage({ params }: { params: { siteId: string } }) {
  const site = { 
    id: params.siteId, 
    name: "Main Office", 
    address: "123 Main St", 
    contactName: "John Doe", 
    contactPhone: "+44 20 1234 5678",
    sitePin: "111111",
    requirements: {
      requiredTraining: ["First Aid", "Security Training"],
      requiredLicences: ["SIA Licence"]
    }
  }; // Mock data for now
  const [pin, setPin] = useState("");
  const [pinStatus, setPinStatus] = useState<"idle" | "success" | "error">("idle");

  if (!site) {
    notFound();
  }

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = pin === site.sitePin; // Simple validation for now
    setPinStatus(isValid ? "success" : "error");
    
    if (isValid) {
      setTimeout(() => {
        setPin("");
        setPinStatus("idle");
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/employee/site-access">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sites
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
        <p className="text-muted-foreground">{site.address}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{site.contactName}</div>
            <p className="text-xs text-muted-foreground mt-1">{site.contactPhone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{site.address.split(',')[0]}</div>
            <p className="text-xs text-muted-foreground mt-1">View on map</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Access Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Authorized</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site PIN Access</CardTitle>
          <CardDescription>
            Enter the site PIN to check in at this location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin">Enter Site PIN</Label>
              <Input
                id="pin"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            {pinStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Access granted! You&apos;re checked in.</p>
              </div>
            )}

            {pinStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                <XCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Invalid PIN. Please try again.</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={pin.length !== 6}>
              <Shield className="mr-2 h-4 w-4" />
              Verify PIN
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Requirements</CardTitle>
          <CardDescription>Required qualifications for this site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Required Training</p>
            <div className="flex flex-wrap gap-2">
              {site.requirements.requiredTraining.map((req: any, idx: any) => (
                <Badge key={idx} variant="secondary">{req}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Required Licences</p>
            <div className="flex flex-wrap gap-2">
              {site.requirements.requiredLicences.map((req: any, idx: any) => (
                <Badge key={idx} variant="secondary">{req}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Directions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <MapPin className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
