"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, MapPin, Clock, Users, List } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getShifts } from "@/lib/services/shift-service-client";
import { getShiftAssignments } from "@/lib/services/shift-service-client";
import { getSites } from "@/lib/services/site-service-client";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";
import ShiftCalendar from "@/components/calendar/shift-calendar";
import MultiDayShiftCreator from "@/components/calendar/multi-day-shift-creator";
import { Shift } from "@/types";

export default function ShiftsPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("calendar");
  const [showMultiDayCreator, setShowMultiDayCreator] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user?.organisationId) {
      fetchShifts();
      fetchSites();
    }
  }, [user]);

  const fetchSites = async () => {
    try {
      const sitesData = await getSites(user.organisationId);
      setSites(sitesData);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const fetchShifts = async () => {
    try {
      const shiftData = await getShifts({ organisationId: user.organisationId });
      setShifts(shiftData);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleShiftClick = (shift: Shift) => {
    // Navigate to shift detail page
    window.location.href = `/company/shifts/${shift.id}`;
  };

  const handleCreateShift = (date: Date) => {
    setSelectedDate(date);
    setShowMultiDayCreator(true);
  };

  const handleCreateMultiDayShifts = async (shifts: Partial<Shift>[]) => {
    try {
      // Use bulk creation for better performance
      const { createMultipleShifts } = await import("@/lib/services/shift-service-client");
      await createMultipleShifts(shifts as any[]);
      
      setShowMultiDayCreator(false);
      fetchShifts(); // Refresh the shifts list
    } catch (error) {
      console.error("Error creating shifts:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shifts</h1>
          <p className="text-muted-foreground">
            Manage and schedule shifts across all sites
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowMultiDayCreator(true)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Multi-Day Schedule
          </Button>
          <Link href="/company/shifts/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Shift
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={view} onValueChange={(value) => setView(value as "list" | "calendar")}>
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {shifts.map((shift: any) => {
              const assignments: any[] = []; // Mock data for now
              const requiredCount = shift.required_roles?.reduce((sum: number, role: any) => sum + role.count, 0) || 0;
              
              return (
                <Card key={shift.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusColor(shift.status)}>
                            {shift.status}
                          </Badge>
                          <h3 className="text-lg font-semibold">{shift.siteName}</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                            <Users className="h-4 w-4" />
                            <span>{assignments.length} / {requiredCount} assigned</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{shift.siteName}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {shift.required_roles?.map((role: any, idx: any) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {role.role} ({role.count})
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Link href={`/company/shifts/${shift.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          {showMultiDayCreator ? (
            <MultiDayShiftCreator
              startDate={selectedDate || startOfMonth(new Date())}
              endDate={endOfMonth(addMonths(new Date(), 1))}
              sites={sites}
              employees={[]} // We don't need employees for shift creation
              onCreateShifts={handleCreateMultiDayShifts}
              onCancel={() => setShowMultiDayCreator(false)}
            />
          ) : (
            <ShiftCalendar
              shifts={shifts}
              onDateSelect={handleDateSelect}
              onShiftClick={handleShiftClick}
              onCreateShift={handleCreateShift}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
