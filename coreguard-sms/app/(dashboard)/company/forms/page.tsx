import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Car, 
  Key, 
  CheckSquare,
  RefreshCw,
  Shield,
  Download,
  Search,
  Filter
} from "lucide-react";

export default function CompanyFormsPage() {
  const formStats = [
    { title: 'Daily Logs', count: 45, icon: FileText, color: 'text-blue-600' },
    { title: 'Incident Reports', count: 12, icon: AlertTriangle, color: 'text-red-600' },
    { title: 'Patrol Logs', count: 89, icon: MapPin, color: 'text-green-600' },
    { title: 'Visitor Logs', count: 156, icon: Users, color: 'text-purple-600' },
  ];

  const recentForms = [
    {
      id: 1,
      type: 'Daily Log',
      site: 'Downtown Office Complex',
      employee: 'John Smith',
      date: '2024-03-15',
      status: 'submitted',
    },
    {
      id: 2,
      type: 'Incident Report',
      site: 'Riverside Shopping Mall',
      employee: 'Sarah Johnson',
      date: '2024-03-15',
      status: 'reviewed',
    },
    {
      id: 3,
      type: 'Patrol Log',
      site: 'Tech Park Building A',
      employee: 'Michael Brown',
      date: '2024-03-14',
      status: 'submitted',
    },
    {
      id: 4,
      type: 'Visitor Log',
      site: 'Downtown Office Complex',
      employee: 'Emily Davis',
      date: '2024-03-14',
      status: 'submitted',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forms Management</h1>
          <p className="text-muted-foreground">
            View and manage all submitted site forms
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {formStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Forms</CardTitle>
              <CardDescription>Filter and search submitted forms</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search forms..." className="pl-8 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Forms</TabsTrigger>
              <TabsTrigger value="daily-logs">Daily Logs</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="patrols">Patrols</TabsTrigger>
              <TabsTrigger value="visitors">Visitors</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              <div className="space-y-3">
                {recentForms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <p className="font-medium">{form.type}</p>
                        <p className="text-sm text-muted-foreground">{form.site}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{form.employee}</p>
                        <p className="text-xs text-muted-foreground">{form.date}</p>
                      </div>
                      <Badge variant={form.status === 'reviewed' ? 'default' : 'secondary'}>
                        {form.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="daily-logs">
              <p className="text-sm text-muted-foreground py-4">Daily logs will appear here</p>
            </TabsContent>

            <TabsContent value="incidents">
              <p className="text-sm text-muted-foreground py-4">Incident reports will appear here</p>
            </TabsContent>

            <TabsContent value="patrols">
              <p className="text-sm text-muted-foreground py-4">Patrol logs will appear here</p>
            </TabsContent>

            <TabsContent value="visitors">
              <p className="text-sm text-muted-foreground py-4">Visitor logs will appear here</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Form Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Daily Log Template
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Incident Report Template
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <MapPin className="mr-2 h-4 w-4" />
              Patrol Log Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold">8</p>
              <p className="text-sm text-muted-foreground mt-1">Forms awaiting review</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Bulk Export
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
