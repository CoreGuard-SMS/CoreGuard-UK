import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Phone, User, Shield } from "lucide-react";
import { getSiteById } from "@/lib/services/site-service-client";
import { getShifts } from "@/lib/services/shift-service-client";
import { format } from "date-fns";

export default function SiteDetailPage({ params }: { params: { siteId: string } }) {
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

  if (!site) {
    notFound();
  }

  const shifts: any[] = []; // Mock data for now

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

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
          <p className="text-muted-foreground">{site.address}</p>
        </div>
        <Button>Edit Site</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site PIN</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.sitePin}</div>
            <p className="text-xs text-muted-foreground mt-1">For employee access</p>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shifts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shifts</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shifts.filter(s => s.status === 'published').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently scheduled</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="access">Access Log</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-sm">{site.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                  <p className="text-sm">{site.contactName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                  <p className="text-sm">{site.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Site PIN</p>
                  <p className="text-sm font-mono font-bold">{site.sitePin}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Shifts</CardTitle>
              <CardDescription>{shifts.length} total shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {format(shift.startTime, 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(shift.startTime, 'h:mm a')} - {format(shift.endTime, 'h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{shift.status}</Badge>
                      <Link href={`/company/shifts/${shift.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Log</CardTitle>
              <CardDescription>Employee check-ins at this site</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access log data will be available once employees start checking in
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
