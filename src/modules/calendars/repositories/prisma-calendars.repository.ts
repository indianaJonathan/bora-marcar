import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCalendarDto } from '../dtos/create-calendar.dto';
import { UpdateCalendarDto } from '../dtos/update-calendar.dto';
import { PrismaService } from 'src/modules/global/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CalendarsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    return await this.prismaService.calendars.findMany({
      where: { deletedAt: null },
    });
  }

  async findAllDeleted() {
    return await this.prismaService.calendars.findMany({
      where: { deletedAt: { not: null } },
    });
  }

  async findOneById(id: string) {
    const calendar = this.prismaService.calendars.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!calendar) throw new NotFoundException('Calendar not found');

    return calendar;
  }

  async findOneDeletedById(id: string) {
    const calendar = await this.prismaService.calendars.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
    });

    if (!calendar) throw new NotFoundException('Deleted calendar not found');

    return calendar;
  }

  async create(calendar: CreateCalendarDto) {
    const { name, ownerId } = calendar;
    const owner = await this.prismaService.users.findUnique({
      where: {
        id: ownerId,
        deletedAt: null,
      },
    });
    if (!owner) throw new NotFoundException('Owner not found');
    const formatCalendar: Prisma.CalendarsCreateInput = {
      name,
      owner: {
        connect: {
          id: owner.id,
        },
      },
    };

    await this.prismaService.calendars.create({ data: formatCalendar });

    return formatCalendar;
  }

  async updateById(id: string, data: UpdateCalendarDto) {
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

  async restoreById(id: string) {
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

  async findCalendarsByOwnerId(ownerId: string) {
    const calendars = await this.prismaService.calendars.findMany({
      where: {
        ownerId,
      },
    });

    if (!calendars || calendars.length == 0)
      throw new NotFoundException('No calendars found for this user');

    return calendars;
  }
}
