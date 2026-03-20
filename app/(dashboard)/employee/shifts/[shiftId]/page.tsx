import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { getShiftById } from "@/lib/services/shift-service-client";
import { format, isToday } from "date-fns";

export default function EmployeeShiftDetailPage({ params }: { params: { shiftId: string } }) {
  const shift = {
    id: params.shiftId,
    startTime: new Date(),
    endTime: new Date(),
    siteName: "Main Office",
    status: "published",
    breakDuration: 60,
    requiredTraining: ["First Aid", "Security Training"],
    requiredLicences: ["SIA Licence"],
    siteId: "site-123"
  }; // Mock data for now

  if (!shift) {
    notFound();
  }

  const canCheckIn = isToday(shift.startTime);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/employee/shifts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shifts
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{shift.siteName}</h1>
          <p className="text-muted-foreground">
            {format(shift.startTime, 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>
        <Badge>{shift.status}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Start Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(shift.startTime, 'h:mm a')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">End Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(shift.endTime, 'h:mm a')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60 * 60))}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">{shift.breakDuration}min break</p>
          </CardContent>
        </Card>
      </div>

      {canCheckIn && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Ready to Check In
            </CardTitle>
            <CardDescription>You can check in for this shift now</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg">
              <CheckCircle className="mr-2 h-4 w-4" />
              Check In Now
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Shift Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{shift.siteName}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Required Training</p>
            <div className="flex flex-wrap gap-2">
              {shift.requiredTraining.map((training: any, idx: any) => (
                <Badge key={idx} variant="secondary">{training}</Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Required Licences</p>
            <div className="flex flex-wrap gap-2">
              {shift.requiredLicences.map((licence: any, idx: any) => (
                <Badge key={idx} variant="secondary">{licence}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href={`/employee/site/${shift.siteId}`}>
            <Button variant="outline" className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              View Site Details & Directions
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <AlertCircle className="mr-2 h-4 w-4" />
            Report an Issue
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Contact Supervisor
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
