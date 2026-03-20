"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, List } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getEmployeeShifts } from "@/lib/services/shift-service";
import { getCalendarEvents } from "@/lib/services/calendar-service";
import { format, isFuture, isPast } from "date-fns";
import CalendarComponent from "@/components/calendar/calendar";
import { CalendarEvent } from "@/types";

export default function EmployeeShiftsPage() {
  const { user } = useAuth();
  const [allShifts, setAllShifts] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("calendar");

  useEffect(() => {
    if (user?.id) {
      fetchShifts();
      fetchCalendarEvents();
    }
  }, [user]);

  const fetchShifts = async () => {
    try {
      const shifts = await getEmployeeShifts(user.id);
      setAllShifts(shifts);
    } catch (error) {
      console.error("Error fetching employee shifts:", error);
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const events = await getCalendarEvents(undefined, user.id);
      setCalendarEvents(events);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingShifts = allShifts.filter((s: any) => isFuture(new Date(s.shifts?.start_time || s.startTime)));
  const pastShifts = allShifts.filter((s: any) => isPast(new Date(s.shifts?.end_time || s.endTime)));

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event);
  };

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading shifts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Shifts</h1>
          <p className="text-muted-foreground">
            View your shift schedule and history
          </p>
        </div>
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "calendar" ? (
        <CalendarComponent
          events={calendarEvents}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      ) : (

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
      )}
    </div>
  );
}
