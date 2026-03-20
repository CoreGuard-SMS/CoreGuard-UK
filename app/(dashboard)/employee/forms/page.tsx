import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Car, 
  Key, 
  CheckSquare,
  RefreshCw,
  Shield
} from "lucide-react";

export default function FormsPage() {
  const forms = [
    {
      id: 'daily-log',
      title: 'Daily Occurrence Log',
      description: 'Record shift activities and events',
      icon: FileText,
      href: '/employee/forms/daily-log',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      id: 'incident-report',
      title: 'Incident Report',
      description: 'Report security incidents',
      icon: AlertTriangle,
      href: '/employee/forms/incident-report',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    {
      id: 'patrol-log',
      title: 'Patrol Log',
      description: 'Track site patrols',
      icon: MapPin,
      href: '/employee/forms/patrol-log',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      id: 'visitor-log',
      title: 'Visitor Log',
      description: 'Log visitor entries',
      icon: Users,
      href: '/employee/forms/visitor-log',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      id: 'vehicle-log',
      title: 'Vehicle Log',
      description: 'Track vehicle movements',
      icon: Car,
      href: '/employee/forms/vehicle-log',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      id: 'key-register',
      title: 'Key Register',
      description: 'Manage key control',
      icon: Key,
      href: '/employee/forms/key-register',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    {
      id: 'equipment-check',
      title: 'Equipment Check',
      description: 'Check equipment status',
      icon: CheckSquare,
      href: '/employee/forms/equipment-check',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    },
    {
      id: 'site-handover',
      title: 'Site Handover',
      description: 'Handover to next shift',
      icon: RefreshCw,
      href: '/employee/forms/site-handover',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-950',
    },
    {
      id: 'risk-report',
      title: 'Risk Observation',
      description: 'Report hazards and risks',
      icon: Shield,
      href: '/employee/forms/risk-report',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Forms</h1>
        <p className="text-muted-foreground">
          Complete forms during your shift for audit and compliance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => {
          const Icon = form.icon;
          return (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${form.bgColor}`}>
                    <Icon className={`h-6 w-6 ${form.color}`} />
                  </div>
                </div>
                <CardTitle className="mt-4">{form.title}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={form.href}>
                  <Button className="w-full">Open Form</Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Forms</CardTitle>
          <CardDescription>Your recently submitted forms</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No forms submitted yet
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
