"use client";

import { useState, useEffect } from "react";
import { CalendarEvent, CalendarDay, CalendarView } from "@/types";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, getDaysInMonth } from "date-fns";
import { generateCalendarDays, navigateCalendar, getWeekDays, getDayEvents, getEventTypeColor, formatEventTime } from "@/lib/services/calendar-service";

interface CalendarProps {
  events: CalendarEvent[];
  view?: CalendarView;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  className?: string;
}

export default function Calendar({ 
  events, 
  view: initialView = "month", 
  onEventClick, 
  onDateClick,
  className = "" 
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleNavigate = (direction: 'prev' | 'next') => {
    setCurrentDate(navigateCalendar(currentDate, direction, view));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick?.(date);
  };

  const renderMonthView = () => {
    const days = generateCalendarDays(currentDate, events);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors
              ${day.isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
              ${day.isToday ? 'ring-2 ring-primary' : ''}
              ${selectedDate && isSameDay(day.date, selectedDate) ? 'bg-primary/10' : ''}
              hover:bg-muted/50
            `}
            onClick={() => handleDateClick(day.date)}
          >
            <div className="text-sm font-medium mb-1">
              {format(day.date, 'd')}
            </div>
            <div className="space-y-1">
              {day.events.slice(0, 3).map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: getEventTypeColor(event.type) + '20', color: getEventTypeColor(event.type) }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick?.(event);
                  }}
                >
                  {format(event.start, 'HH:mm')} {event.title}
                </div>
              ))}
              {day.events.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays(currentDate, events);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="grid grid-cols-8 gap-2">
        {/* Time column */}
        <div className="text-center text-sm font-medium text-muted-foreground p-2">
          Time
        </div>
        
        {/* Week day headers */}
        {weekDays.map((day, index) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
            <div className="text-xs">
              {days[index] && format(days[index].date, 'MMM d')}
            </div>
          </div>
        ))}
        
        {/* Time slots and events */}
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={hour} className="contents">
            <div className="text-xs text-muted-foreground p-2 text-right">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="border-t min-h-[60px] relative">
                {day.events
                  .filter(event => new Date(event.start).getHours() === hour)
                  .map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 absolute inset-x-1"
                      style={{ 
                        backgroundColor: getEventTypeColor(event.type) + '20', 
                        color: getEventTypeColor(event.type),
                        top: `${(new Date(event.start).getMinutes() / 60) * 100}%`
                      }}
                      onClick={() => onEventClick?.(event)}
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getDayEvents(currentDate, events);

    return (
      <div className="space-y-4">
        <div className="text-center text-lg font-medium">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="flex gap-4 border-t pt-2">
              <div className="text-sm text-muted-foreground w-16 text-right">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 min-h-[60px] relative">
                {dayEvents
                  .filter(event => new Date(event.start).getHours() === hour)
                  .map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="p-2 rounded-lg cursor-pointer hover:opacity-80 mb-2"
                      style={{ 
                        backgroundColor: getEventTypeColor(event.type) + '20', 
                        color: getEventTypeColor(event.type)
                      }}
                      onClick={() => onEventClick?.(event)}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm opacity-80">
                        {formatEventTime(event.start, event.end)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getViewTitle = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => handleNavigate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">{getViewTitle()}</h2>
          <Button variant="outline" size="sm" onClick={() => handleNavigate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('month')}
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('day')}
          >
            Day
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <Card>
        <CardContent className="p-4">
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </CardContent>
      </Card>

      {/* Event List Sidebar */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getDayEvents(selectedDate, events).map((event, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatEventTime(event.start, event.end)}
                        </div>
                        {event.data?.siteName && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.data.siteName}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: getEventTypeColor(event.type), 
                        color: getEventTypeColor(event.type) 
                      }}
                    >
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
              {getDayEvents(selectedDate, events).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No events scheduled for this day
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
