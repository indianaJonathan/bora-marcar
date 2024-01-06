import { Injectable, NotFoundException } from '@nestjs/common';
import { CalendarDto } from '../dtos/calendar.dto';
import { CreateCalendarDto } from '../dtos/create-calendar.dto';
import { UpdateCalendarDto } from '../dtos/update-calendar.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CalendarsRepository {
  private calendars: CalendarDto[] = [];

  findAll(): CalendarDto[] {
    return this.calendars.filter((cal) => !cal.deletedAt);
  }

  findAllDeleted(): CalendarDto[] {
    return this.calendars.filter((cal) => cal.deletedAt);
  }

  findOneById(id: string): CalendarDto {
    const calendar = this.calendars.find(
      (cal) => cal.id === id && !cal.deletedAt,
    );
    return calendar;
  }
  findOneDeletedById(id: string): CalendarDto {
    const calendar = this.calendars.find(
      (cal) => cal.id === id && cal.deletedAt,
    );
    if (!calendar) throw new NotFoundException('Deleted calendar not found');
    return calendar;
  }

  create(calendar: CreateCalendarDto): CalendarDto {
    const { name, ownerEmail } = calendar;
    const id = randomUUID();
    const formatCalendar: CalendarDto = {
      id,
      name,
      ownerEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.calendars.push(formatCalendar);
    return formatCalendar;
  }

  updateById(id: string, data: UpdateCalendarDto): CalendarDto {
    const calendar = this.calendars.find(
      (cal) => cal.id === id && !cal.deletedAt,
    );
    if (!calendar) throw new NotFoundException('Calendar not found');

    for (const key in data) {
      calendar[key] = data[key];
    }

    calendar.updatedAt = new Date();

    return calendar;
  }

  deleteById(id: string): string {
    const calendar = this.calendars.find((cal) => cal.id === id);
    if (!calendar) throw new NotFoundException('Calendar not found');
    calendar.deletedAt = new Date();
    return 'Calendar deleted';
  }

  restoreById(id: string): CalendarDto {
    const calendar = this.calendars.find((cal) => cal.id === id);
    if (!calendar) throw new NotFoundException('Deleted calendar not found');
    calendar.deletedAt = null;
    return calendar;
  }
}
