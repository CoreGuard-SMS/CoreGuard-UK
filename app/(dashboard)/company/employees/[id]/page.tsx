"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Mail, Phone, AlertCircle, Edit, Plus, Award, FileText, Upload } from "lucide-react";
import { emailService } from "@/lib/email/resend";
import { useState, useEffect, use } from "react";
import { format } from "date-fns";

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState<any[]>([]);
  const [licences, setLicences] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [isAddingTraining, setIsAddingTraining] = useState(false);
  const [isAddingLicence, setIsAddingLicence] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [trainingFile, setTrainingFile] = useState<File | null>(null);
  const [licenceFile, setLicenceFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`/api/employees/${resolvedParams.id}`);
        const employeeData = await response.json();
        
        if (!response.ok) {
          console.error("Employee not found:", employeeData.error);
          return;
        }

        setEmployee(employeeData);
        setTraining(employeeData.training || []);
        setLicences(employeeData.licences || []);
        setShifts(employeeData.shifts || []);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchEmployeeData();
    }
  }, [resolvedParams.id]);

  if (loading) {
    return <div>Loading employee details...</div>;
  }

  if (!employee) {
    notFound();
  }

  const handleSaveEmployee = async () => {
    try {
      // Here you would implement the actual save logic
      console.log('Saving employee:', editForm);
      // Update the employee state
      setEmployee({...employee, ...editForm});
      setIsEditingEmployee(false);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleAddTraining = async () => {
    try {
      // Here you would implement the actual add training logic with file upload
      console.log('Adding training:', editForm);
      console.log('Training file:', trainingFile);
      
      const newTraining = {
        id: Date.now().toString(),
        certificationName: editForm.certificationName,
        issueDate: editForm.issueDate,
        expiryDate: editForm.expiryDate,
        documentName: trainingFile?.name || null,
        documentSize: trainingFile?.size || null,
        status: 'active'
      };
      
      // In a real implementation, you would upload the file to storage
      // and store the URL/reference in the database
      
      setTraining([...training, newTraining]);
      setIsAddingTraining(false);
      setEditForm({});
      setTrainingFile(null);

      // Send notification email about new training
      if (employee?.email) {
        try {
          await emailService.sendCustomEmail({
            to: employee.email,
            subject: `New Training Certification Added: ${editForm.certificationName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
                  <h1>Training Certification Added</h1>
                </div>
                <div style="padding: 20px; background: #f9fafb;">
                  <p>Hi ${employee.first_name || 'Employee'},</p>
                  <p>A new training certification has been added to your profile:</p>
                  <div style="background: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <p><strong>Certification:</strong> ${editForm.certificationName}</p>
                    <p><strong>Issue Date:</strong> ${editForm.issueDate}</p>
                    <p><strong>Expiry Date:</strong> ${editForm.expiryDate}</p>
                  </div>
                  <p>Please keep this certification up to date for compliance purposes.</p>
                  <p>Best regards,<br>The CoreGuard Team</p>
                </div>
                <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                  <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
                </div>
              </div>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send training notification email:', emailError);
        }
      }
    } catch (error) {
      console.error('Error adding training:', error);
    }
  };

  const handleAddLicence = async () => {
    try {
      // Here you would implement the actual add licence logic with file upload
      console.log('Adding licence:', editForm);
      console.log('Licence file:', licenceFile);
      
      const newLicence = {
        id: Date.now().toString(),
        licenceType: editForm.licenceType,
        licenceNumber: editForm.licenceNumber,
        issueDate: editForm.licenceIssueDate,
        expiryDate: editForm.licenceExpiryDate,
        documentName: licenceFile?.name || null,
        documentSize: licenceFile?.size || null,
        status: 'active'
      };
      
      // In a real implementation, you would upload the file to storage
      // and store the URL/reference in the database
      
      setLicences([...licences, newLicence]);
      setIsAddingLicence(false);
      setEditForm({});
      setLicenceFile(null);

      // Send notification email about new licence
      if (employee?.email) {
        try {
          await emailService.sendCustomEmail({
            to: employee.email,
            subject: `New Licence Added: ${editForm.licenceType}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
                  <h1>Licence Added</h1>
                </div>
                <div style="padding: 20px; background: #f9fafb;">
                  <p>Hi ${employee.first_name || 'Employee'},</p>
                  <p>A new licence has been added to your profile:</p>
                  <div style="background: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <p><strong>Licence Type:</strong> ${editForm.licenceType}</p>
                    <p><strong>Licence Number:</strong> ${editForm.licenceNumber}</p>
                    <p><strong>Issue Date:</strong> ${editForm.licenceIssueDate}</p>
                    <p><strong>Expiry Date:</strong> ${editForm.licenceExpiryDate}</p>
                  </div>
                  <p>Please ensure you keep this licence valid for continued employment.</p>
                  <p>Best regards,<br>The CoreGuard Team</p>
                </div>
                <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                  <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
                </div>
              </div>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send licence notification email:', emailError);
        }
      }
    } catch (error) {
      console.error('Error adding licence:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/company/employees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-muted-foreground">{employee.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
            {employee.status}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setIsEditingEmployee(true);
              setEditForm(employee);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.email || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.phone || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Phone</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.emergency_phone || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.employee_id || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.department || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Start Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {employee.start_date ? format(new Date(employee.start_date), 'MMM dd, yyyy') : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employment Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.employment_type || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salary Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.salary_type || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.salary || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracted Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.contracted_hours || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.work_schedule || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.manager || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{employee.location || 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {employee.sites ? JSON.parse(employee.sites).length || 0 : 0} sites
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="training" className="space-y-4">
        <TabsList>
          <TabsTrigger value="training">Training & Licences</TabsTrigger>
          <TabsTrigger value="shifts">Shift History</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Training Certifications</CardTitle>
                  <CardDescription>{training.length} certifications</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddingTraining(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Training
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {training.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{cert.certificationName}</p>
                      <p className="text-sm text-muted-foreground">
                        Issued: {format(cert.issueDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={cert.status === 'active' ? 'default' : cert.status === 'expiring_soon' ? 'secondary' : 'destructive'}>
                        {cert.status === 'expiring_soon' ? 'Expiring Soon' : cert.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Expires: {format(cert.expiryDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Licences</CardTitle>
                  <CardDescription>{licences.length} licences</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddingLicence(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Licence
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {licences.map((licence) => (
                  <div key={licence.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{licence.licenceType}</p>
                      <p className="text-sm text-muted-foreground">
                        Number: {licence.licenceNumber}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={licence.status === 'active' ? 'default' : 'destructive'}>
                        {licence.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Expires: {format(licence.expiryDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shift History</CardTitle>
              <CardDescription>{shifts.length} shifts assigned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{shift.siteName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(shift.startTime, 'MMM dd, yyyy • h:mm a')} - {format(shift.endTime, 'h:mm a')}
                      </p>
                    </div>
                    <Badge>{shift.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
              <CardDescription>Manage employee availability</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Calendar view coming soon - employee can set availability in their profile
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditingEmployee} onOpenChange={setIsEditingEmployee}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Employee Details</DialogTitle>
            <DialogDescription>
              Update employee information and HR details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editForm.first_name || ''}
                  onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editForm.last_name || ''}
                  onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={editForm.department || ''}
                  onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={editForm.employee_id || ''}
                  onChange={(e) => setEditForm({...editForm, employee_id: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select value={editForm.employment_type || 'Full Time'} onValueChange={(value) => setEditForm({...editForm, employment_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salaryType">Salary Type</Label>
                <Select value={editForm.salary_type || 'salary'} onValueChange={(value) => setEditForm({...editForm, salary_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  value={editForm.salary || ''}
                  onChange={(e) => setEditForm({...editForm, salary: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="contractedHours">Contracted Hours</Label>
                <Input
                  id="contractedHours"
                  value={editForm.contracted_hours || ''}
                  onChange={(e) => setEditForm({...editForm, contracted_hours: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  value={editForm.manager || ''}
                  onChange={(e) => setEditForm({...editForm, manager: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingEmployee(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmployee}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Training Dialog */}
      <Dialog open={isAddingTraining} onOpenChange={setIsAddingTraining}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Training Certification</DialogTitle>
            <DialogDescription>
              Add a new training certification for this employee
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="certificationName">Certification Name</Label>
              <Input
                id="certificationName"
                placeholder="e.g., Security Guard Certification"
                onChange={(e) => setEditForm({...editForm, certificationName: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  onChange={(e) => setEditForm({...editForm, issueDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  onChange={(e) => setEditForm({...editForm, expiryDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>Upload Document</Label>
              <div className="mt-2">
                <input
                  ref={(el) => {
                    if (el) {
                      el.style.display = 'none';
                      el.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) setTrainingFile(file);
                      };
                    }
                  }}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    fileInput?.click();
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Upload PDF, Word, or image files (Max 10MB)
              </p>
              {trainingFile && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    <strong>Selected:</strong> {trainingFile.name}
                  </p>
                  <p className="text-xs text-green-600">
                    Size: {(trainingFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddingTraining(false);
              setTrainingFile(null);
              setEditForm({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddTraining}>Add Training</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Licence Dialog */}
      <Dialog open={isAddingLicence} onOpenChange={setIsAddingLicence}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Licence</DialogTitle>
            <DialogDescription>
              Add a new professional licence for this employee
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="licenceType">Licence Type</Label>
              <Input
                id="licenceType"
                placeholder="e.g., Security Guard License"
                onChange={(e) => setEditForm({...editForm, licenceType: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="licenceNumber">Licence Number</Label>
              <Input
                id="licenceNumber"
                placeholder="e.g., SG-12345"
                onChange={(e) => setEditForm({...editForm, licenceNumber: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenceIssueDate">Issue Date</Label>
                <Input
                  id="licenceIssueDate"
                  type="date"
                  onChange={(e) => setEditForm({...editForm, licenceIssueDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="licenceExpiryDate">Expiry Date</Label>
                <Input
                  id="licenceExpiryDate"
                  type="date"
                  onChange={(e) => setEditForm({...editForm, licenceExpiryDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>Upload Document</Label>
              <div className="mt-2">
                <input
                  ref={(el) => {
                    if (el) {
                      el.style.display = 'none';
                      el.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) setLicenceFile(file);
                      };
                    }
                  }}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const fileInputs = document.querySelectorAll('input[type="file"]');
                    const lastInput = fileInputs[fileInputs.length - 1] as HTMLInputElement;
                    lastInput?.click();
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Upload PDF, Word, or image files (Max 10MB)
              </p>
              {licenceFile && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    <strong>Selected:</strong> {licenceFile.name}
                  </p>
                  <p className="text-xs text-green-600">
                    Size: {(licenceFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddingLicence(false);
              setLicenceFile(null);
              setEditForm({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddLicence}>Add Licence</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
