import { Injectable } from '@nestjs/common';
import { SchedulesRepository } from './repositories/prisma-schedules.repository';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly repository: SchedulesRepository) {}

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

  async create(schedule: CreateScheduleDto) {
    return await this.repository.create(schedule);
  }

  async update(id: string, schedule: UpdateScheduleDto) {
    return await this.repository.updateById(id, schedule);
  }

  async delete(id: string) {
    return await this.repository.deleteById(id);
  }

  async restore(id: string) {
    return await this.repository.restoreById(id);
  }
}
