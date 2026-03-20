"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Download } from "lucide-react";

// Native date utilities to avoid TDZ issues
const format = (date: Date, formatStr: string) => {
  switch (formatStr) {
    case 'PPP':
      return date.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'HH:mm':
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    default:
      return date.toLocaleString();
  }
};

import type { EventType } from "@/types/forms";

interface LogEntry {
  id: string;
  time: string;
  eventType: EventType;
  description: string;
  actionTaken: string;
  reportedTo: string;
}

export default function DailyLogPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState({
    time: format(new Date(), 'HH:mm'),
    eventType: 'patrol' as EventType,
    description: '',
    actionTaken: '',
    reportedTo: '',
  });

  const [shiftInfo, setShiftInfo] = useState({
    siteName: 'Downtown Office Complex',
    date: format(new Date(), 'yyyy-MM-dd'),
    shiftStart: '08:00',
    shiftEnd: '',
    supervisorName: '',
    weather: '',
  });

  const [shiftSummary, setShiftSummary] = useState({
    totalIncidents: 0,
    equipmentIssues: '',
    handoverNotes: '',
  });

  const addEntry = () => {
    if (!currentEntry.description) return;
    
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      ...currentEntry,
    };
    
    setEntries([...entries, newEntry]);
    setCurrentEntry({
      time: format(new Date(), 'HH:mm'),
      eventType: 'patrol',
      description: '',
      actionTaken: '',
      reportedTo: '',
    });
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleSubmit = () => {
    console.log('Submitting daily log...', { shiftInfo, entries, shiftSummary });
    router.push('/employee/forms');
  };

  const eventTypeColors: Record<EventType, string> = {
    patrol: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    incident: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    visitor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    alarm: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    suspicious_activity: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/employee/forms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forms
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Occurrence Log</h1>
          <p className="text-muted-foreground">Record all shift activities and events</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Shift details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input value={shiftInfo.siteName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={shiftInfo.date} onChange={(e) => setShiftInfo({...shiftInfo, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Shift Start Time</Label>
              <Input type="time" value={shiftInfo.shiftStart} onChange={(e) => setShiftInfo({...shiftInfo, shiftStart: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Shift End Time</Label>
              <Input type="time" value={shiftInfo.shiftEnd} onChange={(e) => setShiftInfo({...shiftInfo, shiftEnd: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Supervisor Name</Label>
              <Input value={shiftInfo.supervisorName} onChange={(e) => setShiftInfo({...shiftInfo, supervisorName: e.target.value})} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label>Weather</Label>
              <Input value={shiftInfo.weather} onChange={(e) => setShiftInfo({...shiftInfo, weather: e.target.value})} placeholder="e.g., Clear, Rainy" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log Entries</CardTitle>
          <CardDescription>Record timeline events during your shift</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium">Add New Entry</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" value={currentEntry.time} onChange={(e) => setCurrentEntry({...currentEntry, time: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select value={currentEntry.eventType} onValueChange={(value) => setCurrentEntry({...currentEntry, eventType: value as EventType})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patrol">Patrol</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="visitor">Visitor</SelectItem>
                    <SelectItem value="alarm">Alarm</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={currentEntry.description} onChange={(e) => setCurrentEntry({...currentEntry, description: e.target.value})} placeholder="What happened?" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Action Taken</Label>
                <Input value={currentEntry.actionTaken} onChange={(e) => setCurrentEntry({...currentEntry, actionTaken: e.target.value})} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label>Reported To</Label>
                <Input value={currentEntry.reportedTo} onChange={(e) => setCurrentEntry({...currentEntry, reportedTo: e.target.value})} placeholder="Optional" />
              </div>
            </div>
            <Button onClick={addEntry} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>

          {entries.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">{entries.length} Entries Recorded</h3>
              {entries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{entry.time}</span>
                      <Badge className={eventTypeColors[entry.eventType]}>
                        {entry.eventType.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  <p className="text-sm">{entry.description}</p>
                  {entry.actionTaken && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Action:</span> {entry.actionTaken}
                    </p>
                  )}
                  {entry.reportedTo && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Reported to:</span> {entry.reportedTo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shift Summary</CardTitle>
          <CardDescription>End of shift summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Total Incidents</Label>
            <Input type="number" value={shiftSummary.totalIncidents} onChange={(e) => setShiftSummary({...shiftSummary, totalIncidents: parseInt(e.target.value) || 0})} />
          </div>
          <div className="space-y-2">
            <Label>Equipment Issues</Label>
            <Textarea value={shiftSummary.equipmentIssues} onChange={(e) => setShiftSummary({...shiftSummary, equipmentIssues: e.target.value})} placeholder="Any equipment problems?" rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Handover Notes</Label>
            <Textarea value={shiftSummary.handoverNotes} onChange={(e) => setShiftSummary({...shiftSummary, handoverNotes: e.target.value})} placeholder="Notes for next shift" rows={4} />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button onClick={handleSubmit} size="lg">
          Submit Daily Log
        </Button>
        <Button variant="outline" size="lg">
          Save as Draft
        </Button>
        <Link href="/employee/forms">
          <Button variant="ghost" size="lg">
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}
