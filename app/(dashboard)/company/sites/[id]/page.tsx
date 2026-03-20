"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Phone, Mail, Users, Calendar, Clock, Edit, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import ShiftCalendar from "@/components/calendar/shift-calendar";
import MultiDayShiftCreator from "@/components/calendar/multi-day-shift-creator";

export default function SiteDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;

  const [site, setSite] = useState<any>(null);
  const [shifts, setShifts] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMultiDayCreator, setShowMultiDayCreator] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user?.organisationId && siteId) {
      fetchSiteDetails();
      fetchShifts();
      fetchSites();
    }
  }, [user, siteId]);

  const fetchSiteDetails = async () => {
    try {
      const { getSiteById } = await import("@/lib/services/site-service-client");
      const siteData = await getSiteById(siteId);
      setSite(siteData);
    } catch (error) {
      console.error("Error fetching site details:", error);
    }
  };

  const fetchSites = async () => {
    try {
      const { getSites } = await import("@/lib/services/site-service-client");
      const sitesData = await getSites(user.organisationId);
      setSites(sitesData);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const fetchShifts = async () => {
    try {
      const { getShifts } = await import("@/lib/services/shift-service-client");
      const shiftData = await getShifts({ 
        organisationId: user.organisationId,
        siteId: siteId 
      });
      setShifts(shiftData);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleShiftClick = (shift: any) => {
    // Handle shift click - could open edit modal or navigate to shift details
    console.log("Shift clicked:", shift);
  };

  const handleCreateShift = (date: Date) => {
    setSelectedDate(date);
    // Navigate to shift creation page with pre-filled date and site
    router.push(`/company/shifts/create?date=${date.toISOString()}&siteId=${siteId}`);
  };

  const handleCreateMultiDayShifts = async (bulkShifts: any[]) => {
    try {
      const { createShift } = await import("@/lib/services/shift-service-client");
      
      for (const shift of bulkShifts) {
        await createShift({
          ...shift,
          siteId: siteId,
          organisationId: user.organisationId,
          createdBy: user.id
        });
      }
      
      await fetchShifts();
      setShowMultiDayCreator(false);
    } catch (error) {
      console.error("Error creating shifts:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#3b82f6';
      case 'draft': return '#6b7280';
      case 'in_progress': return '#10b981';
      case 'completed': return '#22c55e';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading site details...</p>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="text-center py-8">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Site not found</h3>
        <p className="text-muted-foreground mb-4">
          The site you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sites
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
            <p className="text-muted-foreground">
              Site management and shift scheduling
            </p>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Site
        </Button>
      </div>

      {/* Site Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Site Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-sm">{site.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">City</p>
                <p className="text-sm">{site.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">PIN Code</p>
                <Badge variant="outline">{site.site_pin || site.pin || 'N/A'}</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                <p className="text-sm">{site.contact_name || site.contactName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{site.contact_phone || site.contactPhone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                  {site.status || 'Active'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shift Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Shift Rota
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowMultiDayCreator(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Multi-Day Shifts
              </Button>
              <Button onClick={() => handleCreateShift(new Date())}>
                <Plus className="h-4 w-4 mr-2" />
                Create Shift
              </Button>
            </div>
          </div>
          <CardDescription>
            Manage shifts and schedule for {site.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="space-y-4">
              <ShiftCalendar
                shifts={shifts}
                sites={[site]} // Only show current site in selector
                onDateSelect={handleDateSelect}
                onShiftClick={handleShiftClick}
                onCreateShift={handleCreateShift}
              />
            </TabsContent>
            <TabsContent value="list" className="space-y-4">
              <div className="space-y-3">
                {shifts.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No shifts scheduled</h3>
                    <p className="text-muted-foreground mb-4">
                      Get started by creating your first shift for this site.
                    </p>
                    <Button onClick={() => handleCreateShift(new Date())}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Shift
                    </Button>
                  </div>
                ) : (
                  shifts.map((shift) => (
                    <Card key={shift.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge style={{ backgroundColor: getStatusColor(shift.status) + '20', color: getStatusColor(shift.status) }}>
                                {shift.status}
                              </Badge>
                              <span className="font-medium">{shift.siteName}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(shift.startTime).toLocaleDateString()} - {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {shift.requiredRoles?.length || 0} roles required
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleShiftClick(shift)}>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Multi-Day Shift Creator Modal */}
      {showMultiDayCreator && (
        <MultiDayShiftCreator
          startDate={new Date()}
          endDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          sites={[site]}
          employees={[]} // We don't need employees for shift creation
          user={user}
          onCreateShifts={handleCreateMultiDayShifts}
          onCancel={() => setShowMultiDayCreator(false)}
        />
      )}
    </div>
  );
}
