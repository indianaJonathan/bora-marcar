import { CalendarDto } from '../../calendars/dtos/calendar.dto';

export class ScheduleDto {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  calendar: CalendarDto;
}
