import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getEmployeeShifts } from "@/lib/services/shift-service-client";
import { format, isFuture, isPast } from "date-fns";

export default function EmployeeShiftsPage() {
  const employeeId = "emp-1";
  const allShifts: any[] = []; // Mock data for now
  const upcomingShifts = allShifts.filter((s: any) => isFuture(s.startTime));
  const pastShifts = allShifts.filter((s: any) => isPast(s.endTime));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Shifts</h1>
        <p className="text-muted-foreground">
          View your shift schedule and history
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {upcomingShifts.map((shift) => (
              <Card key={shift.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="default">Upcoming</Badge>
                        <h3 className="text-lg font-semibold">{shift.siteName}</h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{format(shift.startTime, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(shift.startTime, 'h:mm a')} - {format(shift.endTime, 'h:mm a')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{shift.siteName}</span>
                        </div>
                      </div>
                    </div>

                    <Link href={`/employee/shifts/${shift.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            {upcomingShifts.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No upcoming shifts</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-4">
            {pastShifts.map((shift) => (
              <Card key={shift.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{shift.siteName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(shift.startTime, 'MMM dd, yyyy • h:mm a')} - {format(shift.endTime, 'h:mm a')}
                      </p>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <Link href={`/employee/shifts/${shift.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pastShifts.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No past shifts</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {allShifts.map((shift) => (
              <Card key={shift.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{shift.siteName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(shift.startTime, 'MMM dd, yyyy • h:mm a')} - {format(shift.endTime, 'h:mm a')}
                      </p>
                      <Badge>{shift.status}</Badge>
                    </div>
                    <Link href={`/employee/shifts/${shift.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
