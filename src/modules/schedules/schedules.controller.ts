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
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @ApiResponse({
    status: 200,
    description:
      '[{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }]',
  })
  @Get()
  async findAll() {
    return this.schedulesService.findAll();
  }

  @ApiResponse({
    status: 200,
    description:
      '[{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: "2024-01-01T01:00:00" }]',
  })
  @Get('deleted')
  async findAllDeleted() {
    return this.schedulesService.findAllDeleted();
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
    const response = await this.schedulesService.findOneById(id);
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
      '{ "message": "Deleted schedule not found", "error": "Not Found", "statusCode": 404 }',
  })
  @ApiParam({ name: 'id', type: 'UUID' })
  @Get('deleted/:id')
  async findOneDeletedById(@Param('id') id: string) {
    const response = await this.schedulesService.findOneDeletedById(id);
    if (!response) throw new NotFoundException('Deleted schedule not found');
    return response;
  }

  @ApiResponse({
    status: 201,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }',
  })
  @Post()
  async create(@Body() schedule: CreateScheduleDto) {
    return this.schedulesService.create(schedule);
  }

  @ApiParam({ name: 'id', type: 'UUID' })
  @ApiResponse({
    status: 200,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() schedule: UpdateScheduleDto) {
    return this.schedulesService.update(id, schedule);
  }

  @ApiParam({ name: 'id', type: 'UUID' })
  @ApiResponse({
    status: 200,
    description: 'Calendar deleted',
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.schedulesService.delete(id);
  }

  @ApiParam({ name: 'id', type: 'UUID' })
  @ApiResponse({
    status: 200,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }',
  })
  @Patch('/restore/:id')
  async restore(@Param('id') id: string) {
    return this.schedulesService.restore(id);
  }
}
