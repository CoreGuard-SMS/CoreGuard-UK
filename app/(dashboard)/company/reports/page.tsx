import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Users, MapPin, FileCheck } from "lucide-react";

export default function ReportsPage() {
  const reportTypes = [
    {
      id: 1,
      name: "Shift Summary Report",
      description: "Overview of all shifts, assignments, and attendance",
      icon: Calendar,
      category: "Shifts",
    },
    {
      id: 2,
      name: "Employee Hours Report",
      description: "Total hours worked by each employee",
      icon: Users,
      category: "Employees",
    },
    {
      id: 3,
      name: "Site Activity Report",
      description: "Activity and coverage across all sites",
      icon: MapPin,
      category: "Sites",
    },
    {
      id: 4,
      name: "Compliance Audit Report",
      description: "Certifications, training, and compliance status",
      icon: FileCheck,
      category: "Compliance",
    },
    {
      id: 5,
      name: "Site Access Report",
      description: "Employee check-ins and site access logs",
      icon: MapPin,
      category: "Sites",
    },
    {
      id: 6,
      name: "Training Records Report",
      description: "All training and certifications by employee",
      icon: FileCheck,
      category: "Compliance",
    },
  ];

  const recentReports = [
    {
      id: 1,
      name: "Shift Summary - March 2024",
      generatedAt: "2024-03-15",
      type: "PDF",
    },
    {
      id: 2,
      name: "Employee Hours - February 2024",
      generatedAt: "2024-03-01",
      type: "CSV",
    },
    {
      id: 3,
      name: "Compliance Audit - Q1 2024",
      generatedAt: "2024-02-28",
      type: "PDF",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download reports for your organisation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select a report type to generate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{report.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {report.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                        </div>
                      </div>
                      <Button size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Generated on {report.generatedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{report.type}</Badge>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
