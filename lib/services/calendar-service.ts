import { CalendarEvent, CalendarDay, CalendarView, Shift, CalendarEventType } from '@/types';
import { getShifts } from './shift-service';
import { getEmployeeShifts } from './shift-service';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';

export async function getCalendarEvents(
  organisationId?: string,
  employeeId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<CalendarEvent[]> {
  const events: CalendarEvent[] = [];

  // Get shifts
  if (employeeId) {
    const employeeShifts = await getEmployeeShifts(employeeId);
    const shiftEvents: CalendarEvent[] = employeeShifts.map((shift: any) => ({
      id: shift.shifts?.id || shift.shiftId,
      title: `${shift.shifts?.title || 'Shift'} - ${shift.shifts?.sites?.name || 'Unknown Site'}`,
      start: new Date(shift.shifts?.start_time || shift.startTime),
      end: new Date(shift.shifts?.end_time || shift.endTime),
      type: 'shift' as CalendarEventType,
      color: '#3b82f6',
      data: shift
    }));
    events.push(...shiftEvents);
  } else if (organisationId) {
    const shifts = await getShifts({ organisationId });
    const shiftEvents: CalendarEvent[] = shifts.map(shift => ({
      id: shift.id,
      title: `Shift - ${shift.siteName || 'Unknown Site'}`,
      start: new Date(shift.startTime),
      end: new Date(shift.endTime),
      type: 'shift' as CalendarEventType,
      color: '#3b82f6',
      data: shift
    }));
    events.push(...shiftEvents);
  }

  // Add training events (mock for now - you'd implement this based on your training records)
  // This would need to be implemented based on your training system

  // Add availability/unavailability events
  if (employeeId) {
    // This would need to be implemented based on your availability system
  }

  // Filter by date range if provided
  if (startDate || endDate) {
    return events.filter(event => {
      if (startDate && event.start < startDate) return false;
      if (endDate && event.end > endDate) return false;
      return true;
    });
  }

  return events;
}

export function generateCalendarDays(
  month: Date,
  events: CalendarEvent[]
): CalendarDay[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return days.map(day => {
    const dayEvents = events.filter(event =>
      isSameDay(event.start, day) || isSameDay(event.end, day) ||
      (event.start < day && event.end > day)
    );

    return {
      date: day,
      events: dayEvents,
      isCurrentMonth: isSameMonth(day, month),
      isToday: isSameDay(day, new Date()),
      isSelected: false
    };
  });
}

export function navigateCalendar(
  currentDate: Date,
  direction: 'prev' | 'next',
  view: CalendarView
): Date {
  switch (view) {
    case 'month':
      return direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
    case 'week':
      return direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1);
    case 'day':
      return direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1);
    default:
      return currentDate;
  }
}

export function getWeekDays(currentDate: Date, events: CalendarEvent[]): CalendarDay[] {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return days.map(day => {
    const dayEvents = events.filter(event =>
      isSameDay(event.start, day) || isSameDay(event.end, day) ||
      (event.start < day && event.end > day)
    );

    return {
      date: day,
      events: dayEvents,
      isCurrentMonth: isSameMonth(day, currentDate),
      isToday: isSameDay(day, new Date()),
      isSelected: false
    };
  });
}

export function getDayEvents(currentDate: Date, events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(event =>
    isSameDay(event.start, currentDate) || isSameDay(event.end, currentDate) ||
    (event.start < currentDate && event.end > currentDate)
  );
}

export function getEventTypeColor(type: CalendarEventType): string {
  switch (type) {
    case 'shift':
      return '#3b82f6';
    case 'training':
      return '#10b981';
    case 'holiday':
      return '#f59e0b';
    case 'unavailable':
      return '#ef4444';
    default:
      return '#6b7280';
  }
}

export function formatEventTime(start: Date, end: Date): string {
  const startTime = format(start, 'HH:mm');
  const endTime = format(end, 'HH:mm');
  return `${startTime} - ${endTime}`;
}

export function createRecurringEvents(
  baseEvent: Omit<CalendarEvent, 'id'>,
  pattern: 'daily' | 'weekly' | 'monthly' | 'yearly',
  interval: number,
  endDate?: Date
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  let currentDate = new Date(baseEvent.start);
  const end = endDate || new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

  while (currentDate <= end) {
    const eventStart = new Date(currentDate);
    const eventDuration = baseEvent.end.getTime() - baseEvent.start.getTime();
    const eventEnd = new Date(eventStart.getTime() + eventDuration);

    events.push({
      ...baseEvent,
      id: `${baseEvent.title}-${eventStart.getTime()}`,
      start: eventStart,
      end: eventEnd
    });

    // Move to next occurrence
    switch (pattern) {
      case 'daily':
        currentDate = addDays(currentDate, interval);
        break;
      case 'weekly':
        currentDate = addDays(currentDate, interval * 7);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, interval);
        break;
      case 'yearly':
        currentDate = addMonths(currentDate, interval * 12);
        break;
    }
  }

  return events;
}
