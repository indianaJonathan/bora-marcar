import { ApiProperty } from '@nestjs/swagger';

export class UpdateCalendarDto {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  ownerId?: string;
}
