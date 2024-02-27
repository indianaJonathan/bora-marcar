import { Injectable } from '@nestjs/common';
import { CalendarsRepository } from './repositories/prisma-calendars.repository';
import { CreateCalendarDto } from './dtos/create-calendar.dto';
import { UpdateCalendarDto } from './dtos/update-calendar.dto';

@Injectable()
export class CalendarsService {
  constructor(private readonly repository: CalendarsRepository) {}

  async findAll() {
    return await this.repository.findAll();
  }

  async findAllDeleted() {
    return await this.repository.findAllDeleted();
  }

  async findOneById(id: string) {
    return await this.repository.findOneById(id);
  }

  async findOneDeletedById(id: string) {
    return await this.repository.findOneDeletedById(id);
  }

  async create(calendar: CreateCalendarDto) {
    return await this.repository.create(calendar);
  }

  async update(id: string, calendar: UpdateCalendarDto) {
    return await this.repository.updateById(id, calendar);
  }

  async delete(id: string) {
    return await this.repository.deleteById(id);
  }

  async restore(id: string) {
    return await this.repository.restoreById(id);
  }

  async findCalendarsByOwnerId(id: string) {
    return await this.repository.findCalendarsByOwnerId(id);
  }
}
