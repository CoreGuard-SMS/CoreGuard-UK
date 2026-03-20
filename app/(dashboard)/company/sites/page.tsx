"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Users, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function SitesPage() {
  const { user } = useAuth();
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      if (user?.organisationId) {
        try {
          const { getSites } = await import("@/lib/services/site-service-client");
          const sitesData = await getSites(user.organisationId);
          setSites(sitesData);
        } catch (error) {
          console.error("Error fetching sites:", error);
        }
      }
      setLoading(false);
    };

    fetchSites();
  }, [user]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">
            Manage your locations and site access
          </p>
        </div>
        <Link href="/company/sites/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Site
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading sites...</p>
        </div>
      ) : sites.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No sites yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first site
          </p>
          <Link href="/company/sites/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Site
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card key={site.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                  </div>
                  <Badge variant="outline">PIN: {site.site_pin || site.pin}</Badge>
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                      {site.status || 'Active'}
                    </Badge>
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

                <Link href={`/company/sites/${site.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
