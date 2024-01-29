import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { SchedulesRepository } from './repositories/prisma-schedules.repository';

@Module({
  imports: [],
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesRepository],
})
export class SchedulesModule {}
