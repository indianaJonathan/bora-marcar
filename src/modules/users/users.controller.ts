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
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description:
      '[{ id: "EXAM-PLE", name: "Example", email: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }]',
  })
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @ApiResponse({
    status: 200,
    description:
      '[{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: "2024-01-01T01:00:00" }]',
  })
  @Get('deleted')
  async findAllDeleted() {
    return this.usersService.findAllDeleted();
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
    const response: UserDto = await this.usersService.findOneById(id);
    if (!response) throw new NotFoundException('User not found');
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
      '{ "message": "Deleted user not found", "error": "Not Found", "statusCode": 404 }',
  })
  @ApiParam({ name: 'id', type: 'UUID' })
  @Get('deleted/:id')
  async findOneDeletedById(@Param('id') id: string) {
    const response: UserDto = await this.usersService.findOneDeletedById(id);
    if (!response) throw new NotFoundException('Deleted user not found');
    return response;
  }

  @ApiResponse({
    status: 201,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }',
  })
  @Post()
  async create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @ApiParam({ name: 'id', type: 'UUID' })
  @ApiResponse({
    status: 200,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.usersService.update(id, user);
  }

  @ApiParam({ name: 'id', type: 'UUID' })
  @ApiResponse({
    status: 200,
    description: 'Calendar deleted',
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @ApiParam({ name: 'id', type: 'UUID' })
  @ApiResponse({
    status: 200,
    description:
      '{ id: "EXAM-PLE", name: "Example", ownerEmail: "example@mail.com", createdAt: "2024-01-01T00:00:00", updatedAt: "2024-01-01T00:00:00", deletedAt: null }',
  })
  @Patch('/restore/:id')
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }
}
