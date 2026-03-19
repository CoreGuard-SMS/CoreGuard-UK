"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getSites } from "@/lib/services/site-service";
import { getSuggestedEmployees } from "@/lib/services/employee-service";

export default function CreateShiftPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [shiftDate, setShiftDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.organisationId) {
      fetchSites();
    }
  }, [user]);

  const fetchSites = async () => {
    try {
      const siteData = await getSites(user.organisationId);
      setSites(siteData);
    } catch (error) {
      console.error("Error fetching sites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestions = () => {
    if (selectedSite && shiftDate) {
      setShowSuggestions(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/company/shifts");
  };

  const site = sites.find((s: any) => s.id === selectedSite);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/company/shifts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shifts
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Shift</h1>
        <p className="text-muted-foreground">
          Schedule a shift and assign employees
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shift Details</CardTitle>
            <CardDescription>Basic shift information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site">Site</Label>
              <Select value={selectedSite} onValueChange={(value) => setSelectedSite(value || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site: any) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
              <Input
                id="breakDuration"
                type="number"
                placeholder="30"
                defaultValue="30"
              />
            </div>
          </CardContent>
        </Card>

        {site && (
          <Card>
            <CardHeader>
              <CardTitle>Site Requirements</CardTitle>
              <CardDescription>Required qualifications for {site.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Required Training</p>
                <div className="flex flex-wrap gap-2">
                  {site.requirements.requiredTraining.map((req: any, idx: any) => (
                    <Badge key={idx} variant="secondary">{req}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Required Licences</p>
                <div className="flex flex-wrap gap-2">
                  {site.requirements.requiredLicences.map((req: any, idx: any) => (
                    <Badge key={idx} variant="secondary">{req}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employee Assignment</CardTitle>
                <CardDescription>Smart matching based on qualifications and availability</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGetSuggestions}
                disabled={!selectedSite || !shiftDate}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get Suggestions
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showSuggestions && suggestions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  {suggestions.length} employees match the requirements
                </p>
                {suggestions.slice(0, 5).map((match: any) => (
                  <div key={match.employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">
                            {match.employee.firstName} {match.employee.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{match.employee.role}</p>
                        </div>
                        <Badge variant={match.matchScore >= 80 ? 'default' : 'secondary'}>
                          {match.matchScore}% match
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        {match.reasons.slice(0, 2).map((reason: any, idx: any) => (
                          <p key={idx} className="text-xs text-muted-foreground">• {reason}</p>
                        ))}
                      </div>
                    </div>
                    <Button type="button" size="sm">Assign</Button>
                  </div>
                ))}
              </div>
            ) : showSuggestions ? (
              <p className="text-sm text-muted-foreground">
                No employees match the requirements for this shift
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a site and date to see suggested employees
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" size="lg">
            Create Shift
          </Button>
          <Button type="button" variant="outline" size="lg">
            Save as Draft
          </Button>
          <Link href="/company/shifts">
            <Button type="button" variant="ghost" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
