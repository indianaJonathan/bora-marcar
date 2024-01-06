import { Injectable } from '@nestjs/common';
import { CalendarsRepository } from './repositories/prisma-calendars.repository';
import { CreateCalendarDto } from './dtos/create-calendar.dto';
import { UpdateCalendarDto } from './dtos/update-calendar.dto';
import { CalendarDto } from './dtos/calendar.dto';

@Injectable()
export class CalendarsService {
  constructor(private readonly repository: CalendarsRepository) {}

  async findAll(): Promise<CalendarDto[]> {
    return await this.repository.findAll();
  }

  async findAllDeleted(): Promise<CalendarDto[]> {
    return await this.repository.findAllDeleted();
  }

  async findOneById(id: string): Promise<CalendarDto> {
    return await this.repository.findOneById(id);
  }

  async findOneDeletedById(id: string): Promise<CalendarDto> {
    return await this.repository.findOneDeletedById(id);
  }

  async create(calendar: CreateCalendarDto): Promise<CalendarDto> {
    return await this.repository.create(calendar);
  }

  async update(id: string, calendar: UpdateCalendarDto): Promise<CalendarDto> {
    return await this.repository.updateById(id, calendar);
  }

  async delete(id: string): Promise<string> {
    return await this.repository.deleteById(id);
  }

  async restore(id: string): Promise<CalendarDto> {
    return await this.repository.restoreById(id);
  }
}
