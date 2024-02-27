import { UserDto } from '@/http/users/dtos/user.dto';
import { ScheduleDto } from '@/http/schedules/dtos/schedule.dto';

export class CalendarDto {
  id?: string;
  name: string;

  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;

  owner: UserDto;

  schedules?: ScheduleDto[];
}
