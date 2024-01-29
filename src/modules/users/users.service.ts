import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/prisma-users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async findAll() {
    return await this.repository.findAll();
  }

  async findAllDeleted() {
    return await this.repository.findAllDeleted();
  }

  async findOneById(id: string) {
    return await this.repository.findOneById(id);
  }

  async findOneDeletedById(id: string): Promise<UserDto> {
    return await this.repository.findOneDeletedById(id);
  }

  async create(calendar: CreateUserDto): Promise<UserDto> {
    return await this.repository.create(calendar);
  }

  async update(id: string, calendar: UpdateUserDto): Promise<UserDto> {
    return await this.repository.updateById(id, calendar);
  }

  async delete(id: string): Promise<string> {
    return await this.repository.deleteById(id);
  }

  async restore(id: string): Promise<UserDto> {
    return await this.repository.restoreById(id);
  }
}
