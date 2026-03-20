import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react";
import { getShiftById, getShiftAssignments } from "@/lib/services/shift-service-client";
import { format } from "date-fns";

export default function ShiftDetailPage({ params }: { params: { shiftId: string } }) {
  const shift = {
    id: params.shiftId,
    siteName: "Main Office",
    status: "published",
    startTime: new Date("2024-01-15T09:00:00Z"),
    endTime: new Date("2024-01-15T17:00:00Z"),
    breakDuration: 60,
    requiredRoles: [{ count: 2, role: "Security Guard" }],
    requiredTraining: ["First Aid", "Security Training"],
    requiredLicences: ["SIA Licence"]
  }; // Mock data for now

  if (!shift) {
    notFound();
  }

  const assignments: any[] = []; // Mock data for now
  const requiredCount = shift.requiredRoles.reduce((sum: number, role: any) => sum + role.count, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/company/shifts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shifts
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{shift.siteName}</h1>
            <Badge variant={getStatusColor(shift.status)}>{shift.status}</Badge>
          </div>
          <p className="text-muted-foreground">
            {format(shift.startTime, 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Edit Shift</Button>
          <Button>Publish Shift</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length} / {requiredCount}</div>
            <p className="text-xs text-muted-foreground mt-1">employees</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shift Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Site</p>
                <p className="text-sm text-muted-foreground">{shift.siteName}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Required Roles</p>
              <div className="flex flex-wrap gap-2">
                {shift.requiredRoles.map((role, idx) => (
                  <Badge key={idx} variant="outline">
                    {role.role} ({role.count})
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Required Training</p>
              <div className="flex flex-wrap gap-2">
                {shift.requiredTraining.map((training, idx) => (
                  <Badge key={idx} variant="secondary">{training}</Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Required Licences</p>
              <div className="flex flex-wrap gap-2">
                {shift.requiredLicences.map((licence, idx) => (
                  <Badge key={idx} variant="secondary">{licence}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assigned Employees</CardTitle>
              <Button size="sm" variant="outline">Add Employee</Button>
            </div>
            <CardDescription>{assignments.length} employees assigned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {assignment.checkInTime && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium">{assignment.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{assignment.assignedRole}</p>
                    </div>
                  </div>
                  <Badge variant={assignment.status === 'checked_in' ? 'default' : 'secondary'}>
                    {assignment.status}
                  </Badge>
                </div>
              ))}
              {assignments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No employees assigned yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline">Duplicate Shift</Button>
          <Button variant="outline">Send Notifications</Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            Cancel Shift
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
