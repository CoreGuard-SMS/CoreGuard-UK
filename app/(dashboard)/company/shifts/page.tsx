"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ShiftsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to sites page after a short delay
    const timer = setTimeout(() => {
      router.push('/company/sites');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Rota System Moved to Sites</CardTitle>
            <CardDescription>
              The shift scheduling system has been integrated into individual site management for better organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                What's Changed?
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Each site now has its own dedicated rota calendar</li>
                <li>• Shift management is contextual to specific locations</li>
                <li>• Better organization for multi-site operations</li>
                <li>• Site-specific shift filtering and scheduling</li>
              </ul>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                How to Access Rota Management
              </h3>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Go to the Sites page</li>
                <li>2. Click on any site card</li>
                <li>3. Use the "Manage Rota" button</li>
                <li>4. Create and manage shifts for that specific site</li>
              </ol>
            </div>

            <Button 
              onClick={() => router.push('/company/sites')} 
              className="w-full"
              size="lg"
            >
              Go to Sites & Rota Management
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="text-xs text-muted-foreground">
              You will be redirected automatically in 3 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
