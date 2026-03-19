"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getEmployeeShifts } from "@/lib/actions/shift";
import { format, isFuture, isToday } from "date-fns";

export default function EmployeeDashboardPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const employeeId = "emp-1"; // This should come from auth context
        const shiftData = await getEmployeeShifts(employeeId);
        setShifts(shiftData || []);
      } catch (error) {
        console.error('Error fetching shifts:', error);
        setShifts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  const upcomingShifts = shifts.filter(s => s.startTime && (isFuture(new Date(s.startTime)) || isToday(new Date(s.startTime))));
  const nextShift = upcomingShifts[0];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, John!</h1>
        <p className="text-muted-foreground">
          Here&apos;s your schedule and updates
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shifts This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingShifts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Upcoming shifts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground mt-1">Total hours worked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites Accessible</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Active sites</p>
          </CardContent>
        </Card>
      </div>

      {nextShift && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Next Shift</CardTitle>
                <CardDescription>
                  {isToday(nextShift.startTime) ? 'Today' : format(nextShift.startTime, 'EEEE, MMMM dd')}
                </CardDescription>
              </div>
              <Badge variant="default">Upcoming</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{nextShift.siteName}</p>
                  <p className="text-xs text-muted-foreground">Site</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {format(nextShift.startTime, 'h:mm a')}
                  </p>
                  <p className="text-xs text-muted-foreground">Start time</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {format(nextShift.endTime, 'h:mm a')}
                  </p>
                  <p className="text-xs text-muted-foreground">End time</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {Math.round((nextShift.endTime.getTime() - nextShift.startTime.getTime()) / (1000 * 60 * 60))}h
                  </p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/employee/shifts/${nextShift.id}`} className="flex-1">
                <Button className="w-full">View Details</Button>
              </Link>
              {isToday(nextShift.startTime) && (
                <Button variant="outline" className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check In
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Shifts</CardTitle>
            <CardDescription>{upcomingShifts.length} shifts scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingShifts.slice(0, 3).map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{shift.siteName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(shift.startTime, 'MMM dd • h:mm a')} - {format(shift.endTime, 'h:mm a')}
                    </p>
                  </div>
                  <Link href={`/employee/shifts/${shift.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </div>
              ))}
              {upcomingShifts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming shifts
                </p>
              )}
            </div>
            <Link href="/employee/shifts">
              <Button variant="outline" className="w-full mt-4">
                View All Shifts
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/employee/shifts">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View My Schedule
              </Button>
            </Link>
            <Link href="/employee/site-access">
              <Button className="w-full justify-start" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Access Site
              </Button>
            </Link>
            <Link href="/employee/profile/availability">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Update Availability
              </Button>
            </Link>
            <Link href="/employee/profile">
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                View Certifications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
