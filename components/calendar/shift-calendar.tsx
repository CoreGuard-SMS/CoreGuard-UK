"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday, setHours, setMinutes, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock, MapPin, Users } from "lucide-react";
import { Shift, CalendarEvent } from "@/types";

interface ShiftCalendarProps {
  shifts: Shift[];
  onDateSelect: (date: Date) => void;
  onShiftClick: (shift: Shift) => void;
  onCreateShift: (date: Date) => void;
}

export default function ShiftCalendar({ shifts, onDateSelect, onShiftClick, onCreateShift }: ShiftCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week'>('month');

  // Convert shifts to calendar events
  const calendarEvents: CalendarEvent[] = shifts.map(shift => ({
    id: shift.id,
    title: `${shift.siteName || 'Shift'} - ${format(shift.startTime, 'HH:mm')}`,
    start: new Date(shift.startTime),
    end: new Date(shift.endTime),
    type: 'shift' as const,
    color: getStatusColor(shift.status),
    data: shift
  }));

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
          {format(currentMonth, 'MMMM yyyy')}
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
        const formattedDate = format(day, 'd');
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
                    {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
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
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg ${isToday(day) ? 'text-primary font-bold' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="grid grid-cols-8 gap-2">
              <div className="text-sm text-muted-foreground py-2">
                {format(setHours(new Date(), hour), 'HH:00')}
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
                          {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
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
        {view === 'month' ? (
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
