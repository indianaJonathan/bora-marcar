import { Injectable, NotFoundException } from '@nestjs/common';
import { CalendarDto } from '../dtos/calendar.dto';
import { CreateCalendarDto } from '../dtos/create-calendar.dto';
import { UpdateCalendarDto } from '../dtos/update-calendar.dto';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/modules/global/prisma/prisma.service';

@Injectable()
export class CalendarsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(): Promise<CalendarDto[]> {
    return await this.prismaService.calendars.findMany({
      where: { deletedAt: null },
    });
  }

  async findAllDeleted(): Promise<CalendarDto[]> {
    return await this.prismaService.calendars.findMany({
      where: { deletedAt: { not: null } },
    });
  }

  async findOneById(id: string): Promise<CalendarDto> {
    const calendar = this.prismaService.calendars.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!calendar) throw new NotFoundException('Calendar not found');

    return calendar;
  }

  async findOneDeletedById(id: string): Promise<CalendarDto> {
    const calendar = await this.prismaService.calendars.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
    });

    if (!calendar) throw new NotFoundException('Deleted calendar not found');

    return calendar;
  }

  async create(calendar: CreateCalendarDto): Promise<CalendarDto> {
    const { name, ownerEmail } = calendar;
    const id = randomUUID();
    const formatCalendar: CalendarDto = {
      id,
      name,
      ownerEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.prismaService.calendars.create({ data: formatCalendar });

    return formatCalendar;
  }

  async updateById(id: string, data: UpdateCalendarDto): Promise<CalendarDto> {
    const calendar = this.prismaService.calendars.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!calendar) throw new NotFoundException('Calendar not found');

    for (const key in data) {
      calendar[key] = data[key];
    }

    await this.prismaService.calendars.update({
      where: {
        id,
      },
      data,
    });

    return calendar;
  }

  async deleteById(id: string): Promise<string> {
    const calendar = this.prismaService.calendars.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!calendar) throw new NotFoundException('Calendar not found');

    await this.prismaService.calendars.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return 'Calendar deleted';
  }

  async restoreById(id: string): Promise<CalendarDto> {
    const calendar = this.prismaService.calendars.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
    });

    if (!calendar) throw new NotFoundException('Deleted calendar not found');

    await this.prismaService.calendars.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });

    return calendar;
  }
}
