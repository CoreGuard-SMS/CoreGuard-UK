"use client";

import { useState, useEffect } from "react";
// Native date utilities to avoid TDZ issues
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};
const endOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7);
  return new Date(d.setDate(diff));
};
const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};
const subMonths = (date: Date, months: number) => addMonths(date, -months);
const isSameMonth = (date1: Date, date2: Date) => 
  date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
const isSameDay = (date1: Date, date2: Date) => 
  date1.getFullYear() === date2.getFullYear() && 
  date1.getMonth() === date2.getMonth() && 
  date1.getDate() === date2.getDate();
const isToday = (date: Date) => isSameDay(date, new Date());
const setHours = (date: Date, hours: number) => {
  const d = new Date(date);
  d.setHours(hours, 0, 0, 0);
  return d;
};
const setMinutes = (date: Date, minutes: number) => {
  const d = new Date(date);
  d.setMinutes(minutes);
  return d;
};
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock, MapPin, Users } from "lucide-react";
import { Shift, CalendarEvent, CalendarEventType } from "@/types";

interface ShiftCalendarProps {
  shifts: Shift[];
  sites: any[];
  onDateSelect: (date: Date) => void;
  onShiftClick: (shift: Shift) => void;
  onCreateShift: (date: Date) => void;
}

export default function ShiftCalendar({ shifts, sites, onDateSelect, onShiftClick, onCreateShift }: ShiftCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'year'>('year');
  const [selectedSite, setSelectedSite] = useState<string>('all');

  // Native date formatting to avoid TDZ issues
  const safeFormat = (date: Date, formatStr: string): string => {
    try {
      if (!date || isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      // Use native formatting for common cases to avoid date-fns TDZ issues
      switch (formatStr) {
        case 'HH:mm':
          return date.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          });
        case 'd':
          return date.getDate().toString();
        case 'EEE':
          return date.toLocaleDateString('en-GB', { weekday: 'short' });
        case 'MMMM yyyy':
          return date.toLocaleDateString('en-GB', { 
            month: 'long', 
            year: 'numeric' 
          });
        case 'HH:00':
          return date.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          });
        default:
          // Default fallback for unknown formats
          return date.toLocaleString();
      }
    } catch (error) {
      console.error('Format error:', error, date);
      return 'Format Error';
    }
  };

  // Convert shifts to calendar events
  const calendarEvents: CalendarEvent[] = shifts
    .filter(shift => shift && shift.startTime && shift.endTime)
    .filter(shift => selectedSite === 'all' || shift.siteId === selectedSite)
    .map(shift => {
      try {
        const startDate = new Date(shift.startTime);
        const endDate = new Date(shift.endTime);
        
        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.error('Invalid shift dates:', shift);
          return null;
        }
        
        // Simple time formatting without any libraries
        const formatTime = (date: Date) => {
          try {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
          } catch (error) {
            return '??';
          }
        };

        return {
          id: shift.id,
          title: `${shift.siteName || 'Shift'} - ${formatTime(startDate)}`,
          start: startDate,
          end: endDate,
          type: 'shift' as CalendarEventType,
          color: getStatusColor(shift.status),
          data: shift
        };
      } catch (error) {
        console.error('Error processing shift:', shift, error);
        return null;
      }
    })
    .filter((event): event is NonNullable<typeof event> => event !== null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#3b82f6';
      case 'draft': return '#6b7280';
      case 'in_progress': return '#10b981';
      case 'completed': return '#22c55e';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => 
      isSameDay(event.start, date)
    );
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {view === 'year' ? currentMonth.getFullYear() : safeFormat(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={selectedSite} onValueChange={(value) => setSelectedSite(value || 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            {sites.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant={view === 'year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('year')}
        >
          Year
        </Button>
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
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(new Date())}
        >
          Today
        </Button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = safeFormat(day, 'd');
        const cloneDay = day;
        const events = getEventsForDate(day);
        const isCurrentMonth = isSameMonth(day, currentMonth);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentDay = isToday(day);

        days.push(
          <div
            key={day.toString()}
            className={`
              min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors
              ${!isCurrentMonth ? 'bg-muted/50 text-muted-foreground' : 'bg-background'}
              ${isSelected ? 'ring-2 ring-primary' : ''}
              ${isCurrentDay ? 'bg-primary/10' : ''}
              hover:bg-muted/50
            `}
            onClick={() => {
              setSelectedDate(cloneDay);
              onDateSelect(cloneDay);
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-medium ${isCurrentDay ? 'text-primary' : ''}`}>
                {formattedDate}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateShift(cloneDay);
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-1">
              {events.slice(0, 3).map((event, index) => (
                <div
                  key={event.id}
                  className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: event.color + '20', borderLeft: `2px solid ${event.color}` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onShiftClick(event.data as Shift);
                  }}
                >
                  <div className="truncate font-medium">{event.title}</div>
                  <div className="text-xs opacity-75">
                    {event.start.getHours().toString().padStart(2, '0')}:{event.start.getMinutes().toString().padStart(2, '0')} - {event.end.getHours().toString().padStart(2, '0')}:{event.end.getMinutes().toString().padStart(2, '0')}
                  </div>
                </div>
              ))}
              
              {events.length > 3 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{events.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentMonth);
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      weekDays.push(addDays(weekStart, i));
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-8 gap-2">
          <div className="text-sm font-medium text-muted-foreground">Time</div>
          {weekDays.map(day => (
            <div key={day.toString()} className="text-center">
              <div className="text-sm font-medium">
                {safeFormat(day, 'EEE')}
              </div>
              <div className={`text-lg ${isToday(day) ? 'text-primary font-bold' : ''}`}>
                {safeFormat(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="grid grid-cols-8 gap-2">
              <div className="text-sm text-muted-foreground py-2">
                {safeFormat(setHours(new Date(), hour), 'HH:00')}
              </div>
              {weekDays.map(day => {
                const events = getEventsForDate(day).filter(event => 
                  event.start.getHours() === hour
                );
                
                return (
                  <div key={`${day.toString()}-${hour}`} className="border rounded p-1 min-h-[60px]">
                    {events.map(event => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: event.color + '20', borderLeft: `2px solid ${event.color}` }}
                        onClick={() => onShiftClick(event.data as Shift)}
                      >
                        <div className="truncate font-medium">{event.title}</div>
                        <div className="text-xs opacity-75">
                          {event.start.getHours().toString().padStart(2, '0')}:{event.start.getMinutes().toString().padStart(2, '0')} - {event.end.getHours().toString().padStart(2, '0')}:{event.end.getMinutes().toString().padStart(2, '0')}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const months = [];
    const year = currentMonth.getFullYear();
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      months.push(monthDate);
    }

    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {months.map(monthDate => {
          const monthEvents = calendarEvents.filter(event => 
            event.start.getMonth() === monthDate.getMonth() && 
            event.start.getFullYear() === year
          );
          
          return (
            <Card key={monthDate.toString()} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {safeFormat(monthDate, 'MMMM')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground mb-2">
                  {monthEvents.length} shift{monthEvents.length !== 1 ? 's' : ''}
                </div>
                <div className="space-y-1">
                  {monthEvents.slice(0, 3).map(event => (
                    <div 
                      key={event.id}
                      className="text-xs p-1 rounded"
                      style={{ backgroundColor: event.color + '20' }}
                    >
                      <div className="truncate font-medium">{event.title}</div>
                      <div className="text-xs opacity-75">
                        {event.start.getDate()}/{event.start.getMonth() + 1}
                      </div>
                    </div>
                  ))}
                  {monthEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{monthEvents.length - 3} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Shift Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderHeader()}
        {view === 'year' ? (
          renderYearView()
        ) : view === 'month' ? (
          <>
            {renderDays()}
            {renderCells()}
          </>
        ) : (
          renderWeekView()
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }} />
            Published
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#6b7280' }} />
            Draft
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }} />
            In Progress
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }} />
            Completed
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }} />
            Cancelled
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
