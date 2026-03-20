"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Sparkles, Calendar, Clock, Plus, Trash2, Repeat } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getSites } from "@/lib/services/site-service";
import { getSuggestedEmployees } from "@/lib/services/employee-service";
import { createShift } from "@/lib/services/shift-service";

export default function CreateShiftPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Bulk creation states
  const [bulkShifts, setBulkShifts] = useState<any[]>([]);
  const [recurringPattern, setRecurringPattern] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [recurringEndDate, setRecurringEndDate] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [bulkCreating, setBulkCreating] = useState(false);
  const [createdShifts, setCreatedShifts] = useState<any[]>([]);

  useEffect(() => {
    if (user?.organisationId) {
      fetchSites();
    }
  }, [user]);

  const fetchSites = async () => {
    try {
      const siteData = await getSites(user.organisationId);
      setSites(siteData);
    } catch (error) {
      console.error("Error fetching sites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestions = () => {
    if (selectedSite && shiftDate) {
      setShowSuggestions(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/company/shifts");
  };

  const generateBulkShifts = () => {
    if (!selectedSite || !shiftDate || !startTime || !endTime) return;
    
    const shifts: any[] = [];
    const startDate = new Date(shiftDate);
    const endDate = recurringEndDate ? new Date(recurringEndDate) : null;
    
    const baseShift = {
      siteId: selectedSite,
      siteName: sites.find((s: any) => s.id === selectedSite)?.name,
      startTime: startTime,
      endTime: endTime,
      breakDuration: 30,
      status: 'draft',
      organisationId: user.organisationId,
      createdBy: user.id
    };

    switch (recurringPattern) {
      case 'none':
        shifts.push({ ...baseShift, date: shiftDate });
        break;
        
      case 'daily':
        let currentDate = new Date(startDate);
        while (!endDate || currentDate <= endDate) {
          shifts.push({
            ...baseShift,
            date: currentDate.toISOString().split('T')[0]
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
        break;
        
      case 'weekly':
        let weekDate = new Date(startDate);
        while (!endDate || weekDate <= endDate) {
          if (selectedWeekdays.includes(weekDate.getDay())) {
            shifts.push({
              ...baseShift,
              date: weekDate.toISOString().split('T')[0]
            });
          }
          weekDate.setDate(weekDate.getDate() + 1);
        }
        break;
        
      case 'monthly':
        let monthDate = new Date(startDate);
        while (!endDate || monthDate <= endDate) {
          shifts.push({
            ...baseShift,
            date: monthDate.toISOString().split('T')[0]
          });
          monthDate.setMonth(monthDate.getMonth() + 1);
        }
        break;
    }
    
    setBulkShifts(shifts);
  };

  const handleBulkCreate = async () => {
    setBulkCreating(true);
    const results: any[] = [];
    
    for (const shift of bulkShifts) {
      try {
        const shiftData = {
          ...shift,
          startTime: new Date(`${shift.date}T${shift.startTime}`),
          endTime: new Date(`${shift.date}T${shift.endTime}`),
          createdAt: new Date()
        };
        
        const result = await createShift(shiftData);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error('Error creating shift:', error);
      }
    }
    
    setCreatedShifts(results);
    setBulkCreating(false);
  };

  const toggleWeekday = (day: number) => {
    setSelectedWeekdays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const removeShiftFromBulk = (index: number) => {
    setBulkShifts(prev => prev.filter((_, i) => i !== index));
  };

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const site = sites.find((s: any) => s.id === selectedSite);

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

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Shifts</h1>
        <p className="text-muted-foreground">
          Schedule single or multiple shifts at once
        </p>
      </div>

      <Tabs defaultValue="single" className="space-y-6">
        <TabsList>
          <TabsTrigger value="single">Single Shift</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Creation</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shift Details</CardTitle>
                <CardDescription>Basic shift information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <Select value={selectedSite} onValueChange={(value) => setSelectedSite(value || "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site: any) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={shiftDate}
                      onChange={(e) => setShiftDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                  <Input
                    id="breakDuration"
                    type="number"
                    placeholder="30"
                    defaultValue="30"
                  />
                </div>
              </CardContent>
            </Card>

            {site && (
              <Card>
                <CardHeader>
                  <CardTitle>Site Requirements</CardTitle>
                  <CardDescription>Required qualifications for {site.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Required Training</p>
                    <div className="flex flex-wrap gap-2">
                      {site.requirements.requiredTraining.map((req: any, idx: any) => (
                        <Badge key={idx} variant="secondary">{req}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Required Licences</p>
                    <div className="flex flex-wrap gap-2">
                      {site.requirements.requiredLicences.map((req: any, idx: any) => (
                        <Badge key={idx} variant="secondary">{req}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Employee Assignment</CardTitle>
                    <CardDescription>Smart matching based on qualifications and availability</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetSuggestions}
                    disabled={!selectedSite || !shiftDate}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Suggestions
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showSuggestions && suggestions.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">
                      {suggestions.length} employees match the requirements
                    </p>
                    {suggestions.slice(0, 5).map((match: any) => (
                      <div key={match.employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium">
                                {match.employee.firstName} {match.employee.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">{match.employee.role}</p>
                            </div>
                            <Badge variant={match.matchScore >= 80 ? 'default' : 'secondary'}>
                              {match.matchScore}% match
                            </Badge>
                          </div>
                          <div className="mt-2 space-y-1">
                            {match.reasons.slice(0, 2).map((reason: any, idx: any) => (
                              <p key={idx} className="text-xs text-muted-foreground">• {reason}</p>
                            ))}
                          </div>
                        </div>
                        <Button type="button" size="sm">Assign</Button>
                      </div>
                    ))}
                  </div>
                ) : showSuggestions ? (
                  <p className="text-sm text-muted-foreground">
                    No employees match the requirements for this shift
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a site and date to see suggested employees
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Button type="submit" size="lg">
                Create Shift
              </Button>
              <Button type="button" variant="outline" size="lg">
                Save as Draft
              </Button>
              <Link href="/company/shifts">
                <Button type="button" variant="ghost" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="bulk">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Shift Creation</CardTitle>
                <CardDescription>Create multiple shifts with recurring patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <Select value={selectedSite} onValueChange={(value) => setSelectedSite(value || "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site: any) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={shiftDate}
                      onChange={(e) => setShiftDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recurringPattern">Recurring Pattern</Label>
                  <Select value={recurringPattern} onValueChange={(value: any) => setRecurringPattern(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Recurrence</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {recurringPattern !== 'none' && (
                  <div className="space-y-2">
                    <Label htmlFor="recurringEndDate">End Date</Label>
                    <Input
                      id="recurringEndDate"
                      type="date"
                      value={recurringEndDate}
                      onChange={(e) => setRecurringEndDate(e.target.value)}
                      required
                    />
                  </div>
                )}

                {recurringPattern === 'weekly' && (
                  <div className="space-y-2">
                    <Label>Select Days of Week</Label>
                    <div className="flex gap-2">
                      {weekdayNames.map((day, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox
                            id={`weekday-${index}`}
                            checked={selectedWeekdays.includes(index)}
                            onCheckedChange={() => toggleWeekday(index)}
                          />
                          <Label htmlFor={`weekday-${index}`} className="text-sm">
                            {day}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button type="button" onClick={generateBulkShifts} disabled={!selectedSite || !shiftDate || !startTime || !endTime}>
                  <Repeat className="mr-2 h-4 w-4" />
                  Generate Shifts
                </Button>
              </CardContent>
            </Card>

            {bulkShifts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Shifts ({bulkShifts.length})</CardTitle>
                  <CardDescription>Review and create the following shifts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {bulkShifts.map((shift, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{shift.date}</p>
                            <p className="text-sm text-muted-foreground">
                              {shift.startTime} - {shift.endTime} at {shift.siteName}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeShiftFromBulk(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4">
                    <Button 
                      onClick={handleBulkCreate} 
                      disabled={bulkCreating || bulkShifts.length === 0}
                    >
                      {bulkCreating ? 'Creating...' : `Create ${bulkShifts.length} Shifts`}
                    </Button>
                    <Button variant="outline" onClick={() => setBulkShifts([])}>
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {createdShifts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Successfully Created!</CardTitle>
                  <CardDescription>{createdShifts.length} shifts have been created</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {createdShifts.map((shift, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm">
                          {new Date(shift.startTime).toLocaleDateString()} - {shift.siteName}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4">
                    <Link href="/company/shifts">
                      <Button>View All Shifts</Button>
                    </Link>
                    <Button variant="outline" onClick={() => {
                      setCreatedShifts([]);
                      setBulkShifts([]);
                    }}>
                      Create More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
