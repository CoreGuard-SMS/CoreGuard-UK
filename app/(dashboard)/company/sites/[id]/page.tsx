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
import SiteEditModal from "@/components/sites/site-edit-modal";

export default function SiteDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;

  const [site, setSite] = useState<any>(null);
  const [shifts, setShifts] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [shiftTemplates, setShiftTemplates] = useState<any[]>([]);
  const [shiftAssignments, setShiftAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMultiDayCreator, setShowMultiDayCreator] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (user?.organisationId && siteId) {
      fetchSiteDetails();
      fetchShifts();
      fetchSites();
      fetchEmployees();
      fetchShiftTemplates();
      fetchShiftAssignments();
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
    }
  };

  const fetchEmployees = async () => {
    try {
      // Mock employees for now - in real implementation, fetch employees assigned to this site
      const mockEmployees = [
        { id: '1', name: 'John Doe', role: 'Security Guard', status: 'active' },
        { id: '2', name: 'Jane Smith', role: 'Security Guard', status: 'active' },
        { id: '3', name: 'Mike Johnson', role: 'Team Leader', status: 'active' },
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchShiftTemplates = async () => {
    try {
      // Mock shift templates for this site
      const mockTemplates = [
        { 
          id: '1', 
          name: 'Morning Shift', 
          startTime: '06:00', 
          endTime: '14:00',
          requiredRoles: ['Security Guard'],
          status: 'active'
        },
        { 
          id: '2', 
          name: 'Evening Shift', 
          startTime: '14:00', 
          endTime: '22:00',
          requiredRoles: ['Security Guard'],
          status: 'active'
        },
        { 
          id: '3', 
          name: 'Night Shift', 
          startTime: '22:00', 
          endTime: '06:00',
          requiredRoles: ['Security Guard', 'Team Leader'],
          status: 'active'
        },
      ];
      setShiftTemplates(mockTemplates);
    } catch (error) {
      console.error("Error fetching shift templates:", error);
    }
  };

  const fetchShiftAssignments = async () => {
    try {
      // Mock shift assignments for this site
      const mockAssignments = [
        { 
          id: '1', 
          shiftId: '1', 
          employeeId: '1', 
          date: new Date().toISOString().split('T')[0],
          status: 'assigned'
        },
        { 
          id: '2', 
          shiftId: '2', 
          employeeId: '2', 
          date: new Date().toISOString().split('T')[0],
          status: 'assigned'
        },
      ];
      setShiftAssignments(mockAssignments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shift assignments:", error);
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

  const handleEditSite = () => {
    setShowEditModal(true);
  };

  const handleSiteUpdate = (updatedSite: any) => {
    setSite(updatedSite);
    // Update sites list as well
    setSites(prev => prev.map(s => s.id === updatedSite.id ? updatedSite : s));
  };

  const handleSiteDelete = (deletedSiteId: string) => {
    // Redirect back to sites page after deletion
    router.push('/company/sites');
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
              Complete site management system
            </p>
          </div>
        </div>
        <Button onClick={handleEditSite}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Site
        </Button>
      </div>

      {/* Site Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{employees.length}</p>
                <p className="text-sm text-muted-foreground">Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{shifts.length}</p>
                <p className="text-sm text-muted-foreground">Active Shifts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{shiftTemplates.length}</p>
                <p className="text-sm text-muted-foreground">Shift Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{shiftAssignments.length}</p>
                <p className="text-sm text-muted-foreground">Assignments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Site Management Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="shifts">Shifts</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Site Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Site Information</h3>
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
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <Button onClick={() => setActiveTab('shifts')} className="h-20 flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span>Manage Shifts</span>
                  </Button>
                  <Button onClick={() => setActiveTab('employees')} variant="outline" className="h-20 flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    <span>Manage Employees</span>
                  </Button>
                  <Button onClick={() => setShowMultiDayCreator(true)} variant="outline" className="h-20 flex-col">
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Create Shifts</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employees" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Site Employees</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
              <div className="space-y-3">
                {employees.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No employees assigned</h3>
                    <p className="text-muted-foreground mb-4">
                      Add employees to manage this site's workforce.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Employee
                    </Button>
                  </div>
                ) : (
                  employees.map((employee) => (
                    <Card key={employee.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{employee.name}</span>
                              <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                                {employee.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Schedule</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="shifts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Shift Management</h3>
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
              
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList>
                  <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="space-y-4">
                  <ShiftCalendar
                    shifts={shifts}
                    sites={[site]}
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
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Shift Templates</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
              <div className="space-y-3">
                {shiftTemplates.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No shift templates</h3>
                    <p className="text-muted-foreground mb-4">
                      Create shift templates to quickly schedule common shifts.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Template
                    </Button>
                  </div>
                ) : (
                  shiftTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{template.name}</span>
                              <Badge variant={template.status === 'active' ? 'default' : 'secondary'}>
                                {template.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{template.startTime} - {template.endTime}</span>
                              <span>{template.requiredRoles.join(', ')}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Use</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Shift Assignments</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
              <div className="space-y-3">
                {shiftAssignments.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No shift assignments</h3>
                    <p className="text-muted-foreground mb-4">
                      Assign employees to shifts to manage your workforce.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Assignment
                    </Button>
                  </div>
                ) : (
                  shiftAssignments.map((assignment) => {
                    const employee = employees.find(e => e.id === assignment.employeeId);
                    const shift = shifts.find(s => s.id === assignment.shiftId);
                    
                    return (
                      <Card key={assignment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{employee?.name || 'Unknown Employee'}</span>
                                <Badge variant={assignment.status === 'assigned' ? 'default' : 'secondary'}>
                                  {assignment.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {shift?.siteName || 'Unknown Shift'} - {assignment.date}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="outline" size="sm">Remove</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
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
          employees={employees}
          user={user}
          onCreateShifts={handleCreateMultiDayShifts}
          onCancel={() => setShowMultiDayCreator(false)}
        />
      )}

      {/* Site Edit Modal */}
      {showEditModal && (
        <SiteEditModal
          site={site}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleSiteUpdate}
          onDelete={handleSiteDelete}
        />
      )}
    </div>
  );
}
