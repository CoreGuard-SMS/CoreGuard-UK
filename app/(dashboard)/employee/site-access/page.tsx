"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Shield } from "lucide-react";
import { getSites } from "@/lib/actions/site";
import { useAuth } from "@/hooks/use-auth";

export default function SiteAccessPage() {
  const { user } = useAuth();
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      if (user?.organisationId) {
        const sitesData = await getSites({ organisationId: user.organisationId });
        setSites(sitesData);
      }
      setLoading(false);
    };
    fetchSites();
  }, [user]);

  // For demo purposes, show first 2 sites as accessible
  const accessibleSites = sites.slice(0, 2);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Access</h1>
          <p className="text-muted-foreground">
            View and access your authorized sites
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading sites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Access</h1>
        <p className="text-muted-foreground">
          View and access your authorized sites
        </p>
      </div>

      {accessibleSites.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Accessible Sites</h3>
            <p className="text-muted-foreground mb-4">
              You don't have access to any sites yet. Contact your supervisor.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accessibleSites.map((site) => (
            <Card key={site.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                  </div>
                  <Badge variant="outline">
                    <Shield className="mr-1 h-3 w-3" />
                    Authorized
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {site.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Contact</span>
                    <span className="font-medium">{site.contact_name || site.contactName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{site.contact_phone || site.contactPhone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">City</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {site.city || 'N/A'}
                    </Badge>
                  </div>
                </div>

                <Link href={`/employee/site/${site.id}`}>
                  <Button className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Access Site
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Request Site Access</CardTitle>
          <CardDescription>
            Need access to a new site? Contact your supervisor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Request Access
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
