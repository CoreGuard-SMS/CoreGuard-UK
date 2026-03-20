"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, MapPin, Clock, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getShifts } from "@/lib/services/shift-service-client";
import { getShiftAssignments } from "@/lib/services/shift-service-client";
import { format } from "date-fns";

export default function ShiftsPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    if (user?.organisationId) {
      fetchShifts();
    }
  }, [user]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shifts</h1>
          <p className="text-muted-foreground">
            Manage and schedule shifts across all sites
          </p>
        </div>
        <Link href="/company/shifts/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Shift
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Shifts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
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
                          {shift.requiredRoles.map((role: any, idx: any) => (
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

        <TabsContent value="published" className="space-y-4">
          <div className="grid gap-4">
            {shifts.filter((shift: any) => shift.status === 'published').map((shift: any) => {
              const assignments: any[] = []; // Mock data for now
              const requiredCount = shift.required_roles?.reduce((sum: number, role: any) => sum + role.count, 0) || 0;
              
              return (
                <Card key={shift.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{shift.siteName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(shift.startTime, 'MMM dd, yyyy • h:mm a')} - {format(shift.endTime, 'h:mm a')}
                        </p>
                        <p className="text-sm">
                          {assignments.length} / {requiredCount} employees assigned
                        </p>
                      </div>
                      <Link href={`/company/shifts/${shift.id}`}>
                        <Button variant="outline">View</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {shifts.filter((s: any) => s.status === 'draft').length} draft shifts
          </p>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No completed shifts yet
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
