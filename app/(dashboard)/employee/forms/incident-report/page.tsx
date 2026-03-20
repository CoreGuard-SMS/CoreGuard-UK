"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Download, Upload } from "lucide-react";

// Native date utilities to avoid TDZ issues
const format = (date: Date, formatStr: string) => {
  switch (formatStr) {
    case 'PPP':
      return date.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'yyyy-MM-dd':
      return date.toISOString().split('T')[0];
    case 'HH:mm':
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    default:
      return date.toLocaleString();
  }
};

import type { IncidentType, PersonInvolved } from "@/types/forms";

export default function IncidentReportPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    siteName: 'Downtown Office Complex',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    incidentType: 'suspicious_person' as IncidentType,
    location: '',
    description: '',
    policeContacted: false,
    policeReference: '',
    emergencyServices: '',
    outcome: 'ongoing' as 'resolved' | 'ongoing' | 'escalated',
  });

  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  const [peopleInvolved, setPeopleInvolved] = useState<PersonInvolved[]>([]);
  const [currentPerson, setCurrentPerson] = useState({
    name: '',
    description: '',
    contact: '',
    role: 'witness' as PersonInvolved['role'],
  });

  const actionOptions = [
    'Verbal warning',
    'Person removed',
    'Police called',
    'First aid provided',
    'Area secured',
    'Other',
  ];

  const toggleAction = (action: string) => {
    if (actionsTaken.includes(action)) {
      setActionsTaken(actionsTaken.filter(a => a !== action));
    } else {
      setActionsTaken([...actionsTaken, action]);
    }
  };

  const addPerson = () => {
    if (!currentPerson.name) return;
    setPeopleInvolved([...peopleInvolved, currentPerson]);
    setCurrentPerson({ name: '', description: '', contact: '', role: 'witness' });
  };

  const removePerson = (index: number) => {
    setPeopleInvolved(peopleInvolved.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log('Submitting incident report...', { formData, actionsTaken, peopleInvolved });
    router.push('/employee/forms');
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
          <h1 className="text-3xl font-bold tracking-tight">Incident Report</h1>
          <p className="text-muted-foreground">Report security incidents and events</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Site</Label>
              <Input value={formData.siteName} disabled />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Incident Type</Label>
              <Select value={formData.incidentType} onValueChange={(value) => setFormData({...formData, incidentType: value as IncidentType})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="assault">Assault</SelectItem>
                  <SelectItem value="suspicious_person">Suspicious Person</SelectItem>
                  <SelectItem value="property_damage">Property Damage</SelectItem>
                  <SelectItem value="fire_alarm">Fire Alarm</SelectItem>
                  <SelectItem value="medical_emergency">Medical Emergency</SelectItem>
                  <SelectItem value="trespassing">Trespassing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location & Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Exact Location</Label>
            <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g., Car park, Front entrance, Gate 3" />
          </div>
          <div className="space-y-2">
            <Label>Full Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Provide detailed description of the incident..." rows={6} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions Taken</CardTitle>
          <CardDescription>Select all actions that were taken</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actionOptions.map((action) => (
              <div key={action} className="flex items-center space-x-2">
                <Checkbox id={action} checked={actionsTaken.includes(action)} onCheckedChange={() => toggleAction(action)} />
                <label htmlFor={action} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {action}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>People Involved</CardTitle>
          <CardDescription>Add details of people involved in the incident</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium">Add Person</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={currentPerson.name} onChange={(e) => setCurrentPerson({...currentPerson, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={currentPerson.role} onValueChange={(value) => setCurrentPerson({...currentPerson, role: value as PersonInvolved['role']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="visitor">Visitor</SelectItem>
                    <SelectItem value="suspect">Suspect</SelectItem>
                    <SelectItem value="witness">Witness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={currentPerson.description} onChange={(e) => setCurrentPerson({...currentPerson, description: e.target.value})} placeholder="Physical description, clothing, etc." />
            </div>
            <div className="space-y-2">
              <Label>Contact Details</Label>
              <Input value={currentPerson.contact} onChange={(e) => setCurrentPerson({...currentPerson, contact: e.target.value})} placeholder="Phone or email" />
            </div>
            <Button onClick={addPerson} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Person
            </Button>
          </div>

          {peopleInvolved.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">{peopleInvolved.length} People Recorded</h3>
              {peopleInvolved.map((person, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{person.name}</p>
                        <Badge variant="outline">{person.role}</Badge>
                      </div>
                      {person.description && <p className="text-sm text-muted-foreground">{person.description}</p>}
                      {person.contact && <p className="text-sm text-muted-foreground">Contact: {person.contact}</p>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removePerson(index)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evidence</CardTitle>
          <CardDescription>Upload photos, videos, or documents</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Supported: JPG, PNG, PDF, MP4 (Max 10MB each)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authorities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="police" checked={formData.policeContacted} onCheckedChange={(checked) => setFormData({...formData, policeContacted: checked as boolean})} />
            <label htmlFor="police" className="text-sm font-medium">
              Police Contacted
            </label>
          </div>
          {formData.policeContacted && (
            <div className="space-y-2">
              <Label>Police Reference Number</Label>
              <Input value={formData.policeReference} onChange={(e) => setFormData({...formData, policeReference: e.target.value})} />
            </div>
          )}
          <div className="space-y-2">
            <Label>Emergency Services Involved</Label>
            <Input value={formData.emergencyServices} onChange={(e) => setFormData({...formData, emergencyServices: e.target.value})} placeholder="e.g., Ambulance, Fire Department" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={formData.outcome} onValueChange={(value) => setFormData({...formData, outcome: value as typeof formData.outcome})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button onClick={handleSubmit} size="lg">
          Submit Report
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
