"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react";
import { getShiftById, getShiftAssignments } from "@/lib/services/shift-service-client";
import { getEmployeeById } from "@/lib/services/employee-service-client";

// Native date utilities to avoid TDZ issues
const format = (date: Date, formatStr: string) => {
  switch (formatStr) {
    case 'PPP':
      return date.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'p':
      return date.toLocaleTimeString('en-GB', { 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    default:
      return date.toLocaleString();
  }
};

export default function ShiftDetailPage({ params }: { params: { shiftId: string } }) {
  const [shift, setShift] = useState<any>(null);
  const [assignmentsWithEmployees, setAssignmentsWithEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!params?.shiftId) {
        console.error('No shiftId provided');
        return;
      }

      try {
        console.log('Fetching shift data for ID:', params.shiftId);
        const shiftData = await getShiftById(params.shiftId);
        const assignments = await getShiftAssignments(params.shiftId);

        if (!shiftData) {
          console.error('Shift not found:', params.shiftId);
          notFound();
          return;
        }

        // Fetch employee details for assignments
        const assignmentsWithEmployeesData = await Promise.all(
          assignments.map(async (assignment) => {
            const employee = await getEmployeeById(assignment.employeeId);
            return {
              ...assignment,
              employee
            };
          })
        );

        setShift(shiftData);
        setAssignmentsWithEmployees(assignmentsWithEmployeesData);
      } catch (error) {
        console.error('Error fetching shift data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.shiftId]);

  const requiredCount = shift?.requiredRoles?.reduce((sum: number, role: any) => sum + role.count, 0) || 0;

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

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

  if (!shift) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Shift not found</p>
          <Link href="/company/shifts">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shifts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold tracking-tight">{shift.siteName || 'Unknown Site'}</h1>
            <Badge variant={getStatusColor(shift.status)}>{shift.status}</Badge>
          </div>
          <p className="text-muted-foreground">
            {shift.startTime ? format(shift.startTime, 'EEEE, MMMM dd, yyyy') : 'No date set'}
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
            <div className="text-2xl font-bold">
              {shift.startTime ? format(shift.startTime, 'h:mm a') : 'Not set'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">End Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shift.endTime ? format(shift.endTime, 'h:mm a') : 'Not set'}
            </div>
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
            <div className="text-2xl font-bold">{assignmentsWithEmployees.length} / {requiredCount}</div>
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
                <p className="text-sm text-muted-foreground">{shift.siteName || 'Unknown Site'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Required Roles</p>
              <div className="flex flex-wrap gap-2">
                {shift.requiredRoles?.map((role: any, idx: number) => (
                  <Badge key={idx} variant="outline">
                    {role.role} ({role.count})
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Required Training</p>
              <div className="flex flex-wrap gap-2">
                {shift.requiredTraining?.map((training: any, idx: number) => (
                  <Badge key={idx} variant="secondary">{training}</Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Required Licences</p>
              <div className="flex flex-wrap gap-2">
                {shift.requiredLicences?.map((licence: any, idx: number) => (
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
            <CardDescription>{assignmentsWithEmployees.length} employees assigned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignmentsWithEmployees.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {assignment.checkInTime && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium">
                        {assignment.employee ? 
                          `${assignment.employee.firstName} ${assignment.employee.lastName}` : 
                          'Unknown Employee'
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.assignedRole || 'Employee'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={assignment.status === 'checked_in' ? 'default' : 'secondary'}>
                    {assignment.status}
                  </Badge>
                </div>
              ))}
              {assignmentsWithEmployees.length === 0 && (
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
