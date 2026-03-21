"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Users, Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getShifts } from "@/lib/services/shift-service";
import { getSites } from "@/lib/services/site-service-client";
import { Shift, Site } from "@/types";
import ShiftCalendar from "@/components/calendar/shift-calendar";

export default function ShiftsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.organisationId) return;
      
      try {
        const [shiftsData, sitesData] = await Promise.all([
          getShifts({ organisationId: user.organisationId }),
          getSites(user.organisationId)
        ]);
        
        setShifts(shiftsData);
        setSites(sitesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredShifts = shifts.filter(shift => {
    const matchesSite = selectedSite === "all" || shift.siteId === selectedSite;
    const matchesStatus = selectedStatus === "all" || shift.status === selectedStatus;
    const matchesSearch = searchTerm === "" || 
      getSiteName(shift.siteId).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSite && matchesStatus && matchesSearch;
  });

  const getSiteName = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    return site?.name || "Unknown Site";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shift Management</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (showCalendar) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setShowCalendar(false)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
            <h1 className="text-3xl font-bold">Shift Calendar</h1>
          </div>
          <Button onClick={() => router.push('/company/shifts/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Shifts
          </Button>
        </div>
        
        <ShiftCalendar 
          shifts={filteredShifts}
          sites={sites}
          onDateSelect={(date) => console.log('Date selected:', date)}
          onShiftClick={(shift) => router.push(`/company/shifts/${shift.id}`)}
          onCreateShift={(date) => console.log('Create shift for:', date)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shift Management</h1>
          <p className="text-muted-foreground">
            Manage shifts across all sites and locations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCalendar(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button onClick={() => router.push('/company/shifts/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Shifts
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shifts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSite} onValueChange={(value) => setSelectedSite(value || "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Sites" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value || "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSelectedSite("all");
              setSelectedStatus("all");
              setSearchTerm("");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shifts List */}
      <div className="space-y-4">
        {filteredShifts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No shifts found</h3>
              <p className="text-muted-foreground mb-4">
                {shifts.length === 0 
                  ? "Get started by creating your first shift"
                  : "Try adjusting your filters to see more shifts"}
              </p>
              <Button onClick={() => router.push('/company/shifts/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Shift
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredShifts.map((shift) => (
              <Card key={shift.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/company/shifts/${shift.id}`)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Shift at {getSiteName(shift.siteId)}</h3>
                        <Badge className={getStatusColor(shift.status)}>
                          {shift.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {getSiteName(shift.siteId)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDateTime(shift.startTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {shift.requiredRoles?.reduce((sum, role) => sum + role.count, 0) || 0} required
                        </div>
                      </div>
                      
                      {shift.requiredRoles && shift.requiredRoles.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Roles needed: {shift.requiredRoles.map(r => `${r.role} (${r.count})`).join(", ")}
                        </p>
                      )}
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
