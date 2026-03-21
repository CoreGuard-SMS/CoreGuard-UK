import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { getComplianceFlags, getExpiringCertifications, getExpiringLicences, getComplianceScore } from "@/lib/services/compliance-service-client";

// Native date utilities to avoid TDZ issues
const format = (date: Date, formatStr: string) => {
  switch (formatStr) {
    case 'MMM dd, yyyy':
      return date.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    case 'MMM dd':
      return date.toLocaleDateString('en-GB', { 
        month: 'short', 
        day: 'numeric' 
      });
    default:
      return date.toLocaleString();
  }
};

const differenceInDays = (dateLeft: Date, dateRight: Date) => {
  const diffTime = Math.abs(dateLeft.getTime() - dateRight.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function CompliancePage() {
  const activeFlags: any[] = []; // Mock data for now
  const expiringCerts: any[] = []; // Mock data for now
  const expiringLicences: any[] = []; // Mock data for now
  const complianceScore = { score: 85, compliantEmployees: 12, totalEmployees: 15 }; // Mock data for now

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance</h1>
        <p className="text-muted-foreground">
          Monitor certifications, training, and compliance requirements
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceScore.score}%</div>
            <Progress value={complianceScore.score} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {complianceScore.compliantEmployees} / {complianceScore.totalEmployees} employees compliant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Flags</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFlags.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringCerts.length + expiringLicences.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              0
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Compliance Flags</CardTitle>
          <CardDescription>{activeFlags.length} items requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeFlags.map((flag) => (
              <div key={flag.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{flag.employeeName}</p>
                      <Badge variant={getSeverityColor(flag.severity)}>
                        {flag.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{flag.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Flagged {format(flag.createdAt, 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <Button size="sm">Resolve</Button>
              </div>
            ))}
            {activeFlags.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">All Clear!</p>
                <p className="text-sm text-muted-foreground">No active compliance flags</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expiring Certifications</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringCerts.map((cert) => {
                const daysLeft = differenceInDays(cert.expiryDate, new Date());
                return (
                  <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{cert.certificationName}</p>
                      <p className="text-sm text-muted-foreground">
                        Employee ID: {cert.employeeId}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={daysLeft <= 7 ? 'destructive' : 'secondary'}>
                        {daysLeft} days
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(cert.expiryDate, 'MMM dd')}
                      </p>
                    </div>
                  </div>
                );
              })}
              {expiringCerts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No certifications expiring soon
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expiring Licences</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringLicences.map((licence) => {
                const daysLeft = differenceInDays(licence.expiryDate, new Date());
                return (
                  <div key={licence.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{licence.licenceType}</p>
                      <p className="text-sm text-muted-foreground">
                        {licence.licenceNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={daysLeft <= 7 ? 'destructive' : 'secondary'}>
                        {daysLeft} days
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(licence.expiryDate, 'MMM dd')}
                      </p>
                    </div>
                  </div>
                );
              })}
              {expiringLicences.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No licences expiring soon
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
