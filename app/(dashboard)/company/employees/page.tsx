"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function EmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.organisationId) {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`/api/employees?organisationId=${user.organisationId}`);
      const employeeData = await response.json();
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading employees...</div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your team members and their qualifications
          </p>
        </div>
        <Link href="/company/employees/create">
          <Button className="gap-2">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Employees</CardTitle>
              <CardDescription>{employees.length} total employees</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search employees..." className="pl-8 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Certifications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee: any) => {
                return (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="font-medium">
                        {employee.first_name} {employee.last_name}
                      </div>
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {employee.phone}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">View details</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.status === 'active' ? 'default' : 'secondary'}
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/company/employees/${employee.id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
