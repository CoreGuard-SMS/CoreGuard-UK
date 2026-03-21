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
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock, MapPin, Users, MoreHorizontal } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-muted/50 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="h-8 w-8 p-0 hover:bg-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-3 py-1">
            <h2 className="text-lg font-semibold text-foreground">
              {view === 'year' ? currentMonth.getFullYear() : safeFormat(currentMonth, 'MMMM yyyy')}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="h-8 w-8 p-0 hover:bg-background"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Select value={selectedSite} onValueChange={(value) => setSelectedSite(value || 'all')}>
          <SelectTrigger className="w-[180px] h-9">
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
        
        <div className="flex items-center bg-muted/50 rounded-lg p-1">
          <Button
            variant={view === 'year' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('year')}
            className="h-8 px-3"
          >
            Year
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('month')}
            className="h-8 px-3"
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('week')}
            className="h-8 px-3"
          >
            Week
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(new Date())}
          className="h-9 px-4"
        >
          Today
        </Button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-2 mb-3">
        {days.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground/80 py-2 px-1 bg-muted/30 rounded-md">
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
              min-h-[110px] p-3 border rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden
              ${!isCurrentMonth ? 'bg-muted/30 text-muted-foreground/60 border-muted/50' : 'bg-background border-border'}
              ${isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : ''}
              ${isCurrentDay ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' : ''}
              hover:shadow-md hover:border-primary/30 hover:bg-accent/5
            `}
            onClick={() => {
              setSelectedDate(cloneDay);
              onDateSelect(cloneDay);
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`
                text-sm font-semibold
                ${isCurrentDay ? 'text-primary' : ''}
                ${!isCurrentMonth ? 'text-muted-foreground/60' : ''}
              `}>
                {formattedDate}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 hover:opacity-100 hover:bg-primary/10 rounded-md transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateShift(cloneDay);
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-1.5">
              {events.slice(0, 3).map((event, index) => (
                <div
                  key={event.id}
                  className="text-xs p-2 rounded-md cursor-pointer hover:shadow-sm transition-all duration-200 group"
                  style={{ 
                    backgroundColor: event.color + '15', 
                    borderLeft: `3px solid ${event.color}`,
                    minHeight: '28px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onShiftClick(event.data as Shift);
                  }}
                >
                  <div className="truncate font-medium text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </div>
                  <div className="text-xs opacity-70 text-muted-foreground">
                    {event.start.getHours().toString().padStart(2, '0')}:{event.start.getMinutes().toString().padStart(2, '0')}
                  </div>
                </div>
              ))}
              
              {events.length > 3 && (
                <div className="text-xs text-muted-foreground/80 text-center py-1 px-2 bg-muted/50 rounded-md hover:bg-muted/70 transition-colors cursor-pointer">
                  <MoreHorizontal className="h-3 w-3 inline mr-1" />
                  +{events.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2" key={day.toString()}>
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
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Time header row */}
            <div className="grid grid-cols-25 gap-1 mb-2">
              <div className="col-span-1"></div>
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={`time-${hour}`} className="text-center text-xs font-medium text-muted-foreground p-1 border-b">
                  {safeFormat(setHours(new Date(), hour), 'HH:00')}
                </div>
              ))}
            </div>
            
            {/* Day rows */}
            <div className="space-y-1">
              {weekDays.map(day => {
                const dayEvents = getEventsForDate(day);
                
                return (
                  <div key={day.toString()} className="grid grid-cols-25 gap-1">
                    <div className="text-sm font-medium text-muted-foreground p-2 border-r">
                      {safeFormat(day, 'EEE')}
                      <div className={`text-lg ${isToday(day) ? 'text-primary font-bold' : ''}`}>
                        {safeFormat(day, 'd')}
                      </div>
                    </div>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const hourEvents = dayEvents.filter(event => 
                        event.start.getHours() === hour
                      );
                      
                      return (
                        <div key={`${day.toString()}-${hour}`} className="border rounded p-1 min-h-[40px]">
                          {hourEvents.map(event => (
                            <div
                              key={event.id}
                              className="text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80"
                              style={{ backgroundColor: event.color + '20', borderLeft: `2px solid ${event.color}` }}
                              onClick={() => onShiftClick(event.data as Shift)}
                            >
                              <div className="truncate font-medium">{event.title}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map(monthDate => {
          const monthEvents = calendarEvents.filter(event => 
            event.start.getMonth() === monthDate.getMonth() && 
            event.start.getFullYear() === year
          );
          
          return (
            <Card 
              key={monthDate.toString()} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30 group"
              onClick={() => {
                setCurrentMonth(monthDate);
                setView('month');
              }}
            >
              <CardHeader className="pb-3 bg-gradient-to-r from-muted/30 to-muted/10 group-hover:from-muted/50 group-hover:to-muted/20 transition-colors">
                <CardTitle className="text-sm font-semibold text-foreground">
                  {safeFormat(monthDate, 'MMMM')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-muted-foreground font-medium">
                    {monthEvents.length} shift{monthEvents.length !== 1 ? 's' : ''}
                  </div>
                  {monthEvents.length > 0 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 h-5">
                      Active
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  {monthEvents.slice(0, 3).map(event => (
                    <div 
                      key={event.id}
                      className="text-xs p-2 rounded-md border-l-2 transition-all hover:shadow-sm group"
                      style={{ 
                        backgroundColor: event.color + '10',
                        borderLeftColor: event.color
                      }}
                    >
                      <div className="truncate font-medium text-foreground group-hover:text-primary transition-colors">
                        {event.title}
                      </div>
                      <div className="text-xs opacity-70 text-muted-foreground mt-0.5">
                        {event.start.getDate()}/{event.start.getMonth() + 1}
                      </div>
                    </div>
                  ))}
                  {monthEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground/80 text-center py-2 px-3 bg-muted/50 rounded-md hover:bg-muted/70 transition-colors cursor-pointer">
                      <MoreHorizontal className="h-3 w-3 inline mr-1" />
                      +{monthEvents.length - 3} more
                    </div>
                  )}
                  {monthEvents.length === 0 && (
                    <div className="text-xs text-muted-foreground/50 text-center py-4 italic">
                      No shifts scheduled
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
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 border-b border-border/50">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          Shift Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {renderHeader()}
        <div className="mt-6">
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
        </div>
        
        <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/50">
          <div className="text-sm font-semibold text-foreground mb-3">Status Legend</div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full border-2 border-border" style={{ backgroundColor: '#3b82f6' }} />
              <span className="font-medium">Published</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full border-2 border-border" style={{ backgroundColor: '#6b7280' }} />
              <span className="font-medium">Draft</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full border-2 border-border" style={{ backgroundColor: '#10b981' }} />
              <span className="font-medium">In Progress</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full border-2 border-border" style={{ backgroundColor: '#22c55e' }} />
              <span className="font-medium">Completed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full border-2 border-border" style={{ backgroundColor: '#ef4444' }} />
              <span className="font-medium">Cancelled</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
