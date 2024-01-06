import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CreateCalendarDto } from './dtos/create-calendar.dto';
import { UpdateCalendarDto } from './dtos/update-calendar.dto';
import { CalendarDto } from './dtos/calendar.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Calendars')
@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @ApiResponse({
    status: 200,
    description:
      '[{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }]',
  })
  @Get()
  async findAll() {
    return this.calendarsService.findAll();
  }

  @ApiResponse({
    status: 200,
    description:
      '[{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: "2024-01-01T01:00:00" }]',
  })
  @Get('deleted')
  async findAllDeleted() {
    return this.calendarsService.findAllDeleted();
  }

  @ApiResponse({
    status: 200,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }',
  })
  @ApiResponse({
    status: 404,
    description:
      '{ "message": "Calendar not found", "error": "Not Found", "statusCode": 404 }',
  })
  @ApiParam({ name: 'id', type: 'UUID' })
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const response: CalendarDto = await this.calendarsService.findOneById(id);
    if (!response) throw new NotFoundException('Calendar not found');
    return response;
  }

  @ApiResponse({
    status: 200,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: "2024-01-01T00:00:00" }',
  })
  @ApiResponse({
    status: 404,
    description:
      '{ "message": "Deleted calendar not found", "error": "Not Found", "statusCode": 404 }',
  })
  @ApiParam({ name: 'id', type: 'UUID' })
  @Get('deleted/:id')
  async findOneDeletedById(@Param('id') id: string) {
    const response: CalendarDto =
      await this.calendarsService.findOneDeletedById(id);
    if (!response) throw new NotFoundException('Deleted calendar not found');
    return response;
  }

  @ApiResponse({
    status: 201,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }',
  })
  @Post()
  async create(@Body() calendar: CreateCalendarDto) {
    return this.calendarsService.create(calendar);
  }

  @ApiParam({ name: 'id', type: 'UUID' })
  @ApiResponse({
    status: 200,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() calendar: UpdateCalendarDto) {
    return this.calendarsService.update(id, calendar);
  }

  @ApiParam({ name: 'id', type: 'UUID' })
  @ApiResponse({
    status: 200,
    description: 'Calendar deleted',
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.calendarsService.delete(id);
  }

  @ApiParam({ name: 'id', type: 'UUID' })
  @ApiResponse({
    status: 200,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }',
  })
  @Patch('/restore/:id')
  async restore(@Param('id') id: string) {
    return this.calendarsService.restore(id);
  }
}
