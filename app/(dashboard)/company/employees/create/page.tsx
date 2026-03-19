"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, User, UserPlus, MapPin, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { createEmployee } from "@/lib/actions/employee";
import { getSites } from "@/lib/actions/site";

export default function CreateEmployeePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Security Officer",
    department: "",
    emergencyContact: "",
    emergencyPhone: "",
    employeeId: "",
    startDate: "",
    salaryType: "salary", // salary or hourly
    salary: "",
    contractedHours: "",
    employmentType: "Full Time",
    workSchedule: "8",
    manager: "",
    location: "",
  });

  useEffect(() => {
    const fetchSites = async () => {
      if (user?.organisationId) {
        const sitesData = await getSites({ organisationId: user.organisationId });
        setSites(sitesData);
      }
    };
    fetchSites();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const employeeData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        department: formData.department,
        emergency_contact: formData.emergencyContact,
        emergency_phone: formData.emergencyPhone,
        employee_id: formData.employeeId,
        start_date: formData.startDate,
        salary_type: formData.salaryType,
        salary: formData.salary,
        contracted_hours: formData.contractedHours,
        employment_type: formData.employmentType,
        work_schedule: formData.workSchedule,
        manager: formData.manager,
        location: selectedSites.join(', '), // Store selected sites as comma-separated
        sites: selectedSites, // Store site IDs array
        organisation_id: user.organisationId,
        status: "active",
      };

      const result = await createEmployee(employeeData);
      
      if (result) {
        // Redirect to employees page
        window.location.href = "/company/employees";
      } else {
        alert("Error creating employee. Please try again.");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Error creating employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSiteSelection = (siteId: string) => {
    setSelectedSites(prev => {
      if (prev.includes(siteId)) {
        return prev.filter(id => id !== siteId);
      } else {
        return [...prev, siteId];
      }
    });
  };

  const removeSite = (siteId: string) => {
    setSelectedSites(prev => prev.filter(id => id !== siteId));
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

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Employee
          </CardTitle>
          <CardDescription>
            Fill in the employee details below to add a new team member.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value || "Security Officer")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Security Officer">Security Officer</SelectItem>
                    <SelectItem value="Senior Security Officer">Senior Security Officer</SelectItem>
                    <SelectItem value="Security Supervisor">Security Supervisor</SelectItem>
                    <SelectItem value="Security Manager">Security Manager</SelectItem>
                    <SelectItem value="Mobile Patrol">Mobile Patrol</SelectItem>
                    <SelectItem value="Control Room Operator">Control Room Operator</SelectItem>
                    <SelectItem value="Dog Handler">Dog Handler</SelectItem>
                    <SelectItem value="CCTV Operator">CCTV Operator</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value || "Operations")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Mobile Patrol">Mobile Patrol</SelectItem>
                    <SelectItem value="Control Room">Control Room</SelectItem>
                    <SelectItem value="Corporate Security">Corporate Security</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">HR Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange("employeeId", e.target.value)}
                    placeholder="EMP-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryType">Salary Type</Label>
                  <Select
                    value={formData.salaryType}
                    onValueChange={(value) => handleInputChange("salaryType", value || "salary")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">
                    {formData.salaryType === "hourly" ? "Hourly Rate (£)" : "Annual Salary (£)"}
                  </Label>
                  <Input
                    id="salary"
                    type="text"
                    value={formData.salary}
                    onChange={(e) => handleInputChange("salary", e.target.value)}
                    placeholder={formData.salaryType === "hourly" ? "£15.50" : "£35,000"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractedHours">Contracted Hours (per week)</Label>
                  <Input
                    id="contractedHours"
                    type="text"
                    value={formData.contractedHours}
                    onChange={(e) => handleInputChange("contractedHours", e.target.value)}
                    placeholder="37.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value) => handleInputChange("employmentType", value || "Full Time")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Time">Full Time</SelectItem>
                      <SelectItem value="Part Time">Part Time</SelectItem>
                      <SelectItem value="Relief">Relief</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workSchedule">Work Schedule (Hours)</Label>
                  <Select
                    value={formData.workSchedule}
                    onValueChange={(value) => handleInputChange("workSchedule", value || "8")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select work hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Work Locations</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sites..." />
                          </SelectTrigger>
                          <SelectContent>
                            {sites.map((site) => (
                              <div
                                key={site.id}
                                className="px-2 py-1 hover:bg-accent cursor-pointer flex items-center gap-2"
                                onClick={() => handleSiteSelection(site.id)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedSites.includes(site.id)}
                                  onChange={() => {}}
                                  className="rounded"
                                />
                                <span>{site.name}</span>
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Link href="/company/sites/create">
                        <Button variant="outline" size="sm" type="button" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          Add Site
                        </Button>
                      </Link>
                    </div>
                    {selectedSites.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedSites.map((siteId) => {
                          const site = sites.find(s => s.id === siteId);
                          return (
                            <div
                              key={siteId}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-sm text-sm"
                            >
                              <MapPin className="h-3 w-3" />
                              {site?.name}
                              <button
                                type="button"
                                onClick={() => removeSite(siteId)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Select one or more sites where this employee will work
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => handleInputChange("manager", e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                {loading ? "Creating..." : "Create Employee"}
              </Button>
              <Link href="/company/employees">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
