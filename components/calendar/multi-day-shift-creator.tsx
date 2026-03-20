"use client";

import { useState } from "react";
import { format, addDays, eachDayOfInterval, isSameDay, setHours, setMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, X, Repeat, Users, MapPin } from "lucide-react";
import { Shift, Site, Employee } from "@/types";

interface ShiftTemplate {
  siteId: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  requiredRoles: { role: string; count: number }[];
  requiredTraining: string[];
  requiredLicences: string[];
  status: 'draft' | 'published';
}

interface MultiDayShiftCreatorProps {
  startDate: Date;
  endDate: Date;
  sites: Site[];
  employees: Employee[];
  user: any;
  onCreateShifts: (shifts: Partial<Shift>[]) => void;
  onCancel: () => void;
}

export default function MultiDayShiftCreator({ 
  startDate, 
  endDate, 
  sites, 
  employees, 
  user,
  onCreateShifts, 
  onCancel 
}: MultiDayShiftCreatorProps) {
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [shiftTemplate, setShiftTemplate] = useState<ShiftTemplate>({
    siteId: "",
    startTime: "09:00",
    endTime: "17:00",
    breakDuration: 60,
    requiredRoles: [],
    requiredTraining: [],
    requiredLicences: [],
    status: "draft"
  });
  const [recurringPattern, setRecurringPattern] = useState({
    enabled: false,
    type: 'weekly' as 'weekly' | 'daily',
    interval: 1,
    daysOfWeek: [] as number[]
  });

  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

  const toggleDay = (day: Date) => {
    setSelectedDays(prev => {
      if (prev.some(d => isSameDay(d, day))) {
        return prev.filter(d => !isSameDay(d, day));
      } else {
        return [...prev, day];
      }
    });
  };

  const addRequiredRole = () => {
    setShiftTemplate(prev => ({
      ...prev,
      requiredRoles: [...prev.requiredRoles, { role: "", count: 1 }]
    }));
  };

  const updateRequiredRole = (index: number, field: 'role' | 'count', value: string | number) => {
    setShiftTemplate(prev => ({
      ...prev,
      requiredRoles: prev.requiredRoles.map((role, i) => 
        i === index ? { ...role, [field]: value } : role
      )
    }));
  };

  const removeRequiredRole = (index: number) => {
    setShiftTemplate(prev => ({
      ...prev,
      requiredRoles: prev.requiredRoles.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = (type: 'training' | 'licence', value: string) => {
    if (value.trim()) {
      setShiftTemplate(prev => ({
        ...prev,
        [type === 'training' ? 'requiredTraining' : 'requiredLicences']: 
          [...(prev[type === 'training' ? 'requiredTraining' : 'requiredLicences']), value.trim()]
      }));
    }
  };

  const removeRequirement = (type: 'training' | 'licence', index: number) => {
    setShiftTemplate(prev => ({
      ...prev,
      [type === 'training' ? 'requiredTraining' : 'requiredLicences']: 
        prev[type === 'training' ? 'requiredTraining' : 'requiredLicences'].filter((_, i) => i !== index)
    }));
  };

  const generateShifts = () => {
    const shifts: Partial<Shift>[] = [];
    
    const daysToCreate = recurringPattern.enabled 
      ? selectedDays.filter(day => {
          const dayOfWeek = day.getDay();
          return recurringPattern.daysOfWeek.includes(dayOfWeek);
        })
      : selectedDays;

    daysToCreate.forEach(day => {
      const [startHour, startMinute] = shiftTemplate.startTime.split(':').map(Number);
      const [endHour, endMinute] = shiftTemplate.endTime.split(':').map(Number);
      
      const startTime = setMinutes(setHours(day, startHour), startMinute);
      const endTime = setMinutes(setHours(day, endHour), endMinute);

      shifts.push({
        organisationId: user?.organisationId,
        siteId: shiftTemplate.siteId,
        siteName: sites.find(s => s.id === shiftTemplate.siteId)?.name,
        startTime,
        endTime,
        breakDuration: shiftTemplate.breakDuration,
        requiredRoles: shiftTemplate.requiredRoles,
        requiredTraining: shiftTemplate.requiredTraining,
        requiredLicences: shiftTemplate.requiredLicences,
        status: shiftTemplate.status,
        createdBy: user?.id,
        recurring: recurringPattern.enabled ? {
          pattern: recurringPattern.type,
          interval: recurringPattern.interval,
          daysOfWeek: recurringPattern.daysOfWeek
        } : undefined
      });
    });

    return shifts;
  };

  const handleCreate = () => {
    const shifts = generateShifts();
    onCreateShifts(shifts);
  };

  const isFormValid = selectedDays.length > 0 && shiftTemplate.siteId && shiftTemplate.requiredRoles.some(r => r.role);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Create Multi-Day Shifts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div>
          <Label className="text-base font-medium">Select Days</Label>
          <div className="mt-2 text-sm text-muted-foreground mb-4">
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysInRange.map(day => (
              <Button
                key={day.toString()}
                variant={selectedDays.some(d => isSameDay(d, day)) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleDay(day)}
                className="h-10"
              >
                <div className="text-center">
                  <div className="text-xs">{format(day, 'EEE')}</div>
                  <div className="font-medium">{format(day, 'd')}</div>
                </div>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="recurring"
              checked={recurringPattern.enabled}
              onCheckedChange={(checked) => setRecurringPattern(prev => ({ ...prev, enabled: checked as boolean }))}
            />
            <Label htmlFor="recurring">Recurring Pattern</Label>
          </div>

          {recurringPattern.enabled && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pattern</Label>
                  <Select value={recurringPattern.type} onValueChange={(value: 'weekly' | 'daily' | null) => setRecurringPattern(prev => ({ ...prev, type: value as 'weekly' | 'daily' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Interval</Label>
                  <Input
                    type="number"
                    min="1"
                    value={recurringPattern.interval}
                    onChange={(e) => setRecurringPattern(prev => ({ ...prev, interval: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              {recurringPattern.type === 'weekly' && (
                <div>
                  <Label>Days of Week</Label>
                  <div className="flex gap-2 mt-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <Button
                        key={day}
                        variant={recurringPattern.daysOfWeek.includes(index) ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRecurringPattern(prev => ({
                          ...prev,
                          daysOfWeek: prev.daysOfWeek.includes(index)
                            ? prev.daysOfWeek.filter(d => d !== index)
                            : [...prev.daysOfWeek, index]
                        }))}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shift Template */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Shift Template</Label>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Site</Label>
              <Select value={shiftTemplate.siteId} onValueChange={(value) => setShiftTemplate(prev => ({ ...prev, siteId: value || '' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map(site => (
                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={shiftTemplate.status} onValueChange={(value: 'draft' | 'published' | null) => setShiftTemplate(prev => ({ ...prev, status: (value as 'draft' | 'published') || 'draft' }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={shiftTemplate.startTime}
                onChange={(e) => setShiftTemplate(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={shiftTemplate.endTime}
                onChange={(e) => setShiftTemplate(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
            <div>
              <Label>Break (minutes)</Label>
              <Input
                type="number"
                value={shiftTemplate.breakDuration}
                onChange={(e) => setShiftTemplate(prev => ({ ...prev, breakDuration: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          {/* Required Roles */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Required Roles</Label>
              <Button variant="outline" size="sm" onClick={addRequiredRole}>
                <Plus className="h-4 w-4 mr-1" />
                Add Role
              </Button>
            </div>
            
            <div className="space-y-2">
              {shiftTemplate.requiredRoles.map((role, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Role name"
                    value={role.role}
                    onChange={(e) => updateRequiredRole(index, 'role', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Count"
                    min="1"
                    value={role.count}
                    onChange={(e) => updateRequiredRole(index, 'count', parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeRequiredRole(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Required Training</Label>
              <div className="space-y-2 mt-2">
                {shiftTemplate.requiredTraining.map((training, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="secondary">{training}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement('training', index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Required Licences</Label>
              <div className="space-y-2 mt-2">
                {shiftTemplate.requiredLicences.map((licence, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="secondary">{licence}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement('licence', index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Summary</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Selected Days: {selectedDays.length}</div>
            <div>Shifts to Create: {generateShifts().length}</div>
            <div>Site: {sites.find(s => s.id === shiftTemplate.siteId)?.name || 'Not selected'}</div>
            <div>Time: {shiftTemplate.startTime} - {shiftTemplate.endTime}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button onClick={handleCreate} disabled={!isFormValid}>
            Create {generateShifts().length} Shifts
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
