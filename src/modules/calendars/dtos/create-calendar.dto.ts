import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCalendarDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  ownerId: string;
}
