export class CreateScheduleDto {
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  calendarId: string;
}
