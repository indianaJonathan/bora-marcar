import { Module } from '@nestjs/common';
import { CalendarsController } from './calendars.controller';
import { CalendarsService } from './calendars.service';
import { CalendarsRepository } from './repositories/prisma-calendars.repository';

@Module({
  imports: [],
  controllers: [CalendarsController],
  providers: [CalendarsService, CalendarsRepository],
})
export class CalendarsModule {}
