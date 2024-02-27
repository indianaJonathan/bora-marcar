import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from '../dtos/create-schedule.dto';
import { UpdateScheduleDto } from '../dtos/update-schedule.dto';
import { PrismaService } from '@/http/global/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SchedulesRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    return await this.prismaService.schedules.findMany({
      where: { deletedAt: null },
    });
  }

  async findAllDeleted() {
    return await this.prismaService.schedules.findMany({
      where: { deletedAt: { not: null } },
    });
  }

  async findOneById(id: string) {
    const schedule = this.prismaService.schedules.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!schedule) throw new NotFoundException('Schedule not found');

    return schedule;
  }

  async findOneDeletedById(id: string) {
    const schedule = await this.prismaService.schedules.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
    });

    if (!schedule) throw new NotFoundException('Deleted schedule not found');

    return schedule;
  }

  async create(schedule: CreateScheduleDto) {
    const { name, startDate, endDate, calendarId } = schedule;
    const calendar = await this.prismaService.calendars.findUnique({
      where: {
        id: calendarId,
        deletedAt: null,
      },
    });
    if (!calendar) throw new NotFoundException('Calendar not found');
    const formatSchedule: Prisma.SchedulesCreateInput = {
      name,
      startDate,
      endDate,
      calendar: {
        connect: {
          id: calendar.id,
        },
      },
    };

    await this.prismaService.schedules.create({ data: formatSchedule });

    return formatSchedule;
  }

  async updateById(id: string, data: UpdateScheduleDto) {
    const schedule = this.prismaService.schedules.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!schedule) throw new NotFoundException('Schedule not found');

    for (const key in data) {
      schedule[key] = data[key];
    }

    await this.prismaService.schedules.update({
      where: {
        id,
      },
      data,
    });

    return schedule;
  }

  async deleteById(id: string): Promise<string> {
    const schedule = this.prismaService.schedules.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!schedule) throw new NotFoundException('Schedule not found');

    await this.prismaService.schedules.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return 'Schedule deleted';
  }

  async restoreById(id: string) {
    const schedule = this.prismaService.schedules.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
    });

    if (!schedule) throw new NotFoundException('Deleted schedule not found');

    await this.prismaService.schedules.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });

    return schedule;
  }
}
