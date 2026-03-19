"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default function AvailabilityPage() {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/employee/profile">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Availability</h1>
        <p className="text-muted-foreground">
          Set your available and unavailable dates
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Dates</CardTitle>
            <CardDescription>
              Choose dates when you are unavailable
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={setSelectedDates}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unavailable Dates</CardTitle>
            <CardDescription>
              {selectedDates?.length || 0} dates marked as unavailable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {selectedDates && selectedDates.length > 0 ? (
                selectedDates.map((date, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{date.toLocaleDateString()}</span>
                    <Badge variant="secondary">Unavailable</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No unavailable dates selected
                </p>
              )}
            </div>

            <Button className="w-full">Save Availability</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recurring Patterns</CardTitle>
          <CardDescription>
            Set recurring availability patterns (e.g., unavailable every Monday)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Recurring patterns feature coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
