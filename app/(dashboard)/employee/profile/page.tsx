"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, AlertCircle, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Native date utilities to avoid TDZ issues
const format = (date: Date, formatStr: string) => {
  switch (formatStr) {
    case 'MMM dd, yyyy':
      return date.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    default:
      return date.toLocaleString();
  }
};

export default function EmployeeProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState<any[]>([]);
  const [licences, setLicences] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for now - replace with real API calls
    setTraining([
      {
        id: "1",
        training_type: "Basic Security Training",
        certification_name: "Security Guard Certification",
        issue_date: "2024-01-15",
        expiry_date: "2025-01-15",
        status: "active"
      }
    ]);
    
    setLicences([
      {
        id: "1",
        licence_type: "Security Guard License",
        licence_number: "SG-12345",
        issue_date: "2024-01-15",
        expiry_date: "2025-01-15",
        status: "active"
      }
    ]);
    
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and qualifications
          </p>
        </div>
        <Button>Edit Profile</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{user?.email || 'john.doe@company.com'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">+44 123 456 7890</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Contact</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">Jane Doe - +44 987 654 3210</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="training" className="space-y-4">
        <TabsList>
          <TabsTrigger value="training">Training & Certifications</TabsTrigger>
          <TabsTrigger value="licences">Licences</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Certifications</CardTitle>
              <CardDescription>{training.length} certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {training.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{cert.certificationName}</p>
                      <p className="text-sm text-muted-foreground">
                        Issued: {format(cert.issueDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={cert.status === 'active' ? 'default' : cert.status === 'expiring_soon' ? 'secondary' : 'destructive'}>
                        {cert.status === 'expiring_soon' ? 'Expiring Soon' : cert.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Expires: {format(cert.expiryDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Licences</CardTitle>
              <CardDescription>{licences.length} licences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licences.map((licence) => (
                  <div key={licence.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{licence.licenceType}</p>
                      <p className="text-sm text-muted-foreground">
                        Number: {licence.licenceNumber}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={licence.status === 'active' ? 'default' : 'destructive'}>
                        {licence.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Expires: {format(licence.expiryDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/employee/profile/availability">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Availability
            </Button>
          </Link>
          <Button variant="outline" className="w-full justify-start">
            Upload Certification
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Update Emergency Contact
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
