import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/prisma-users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

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

  async findOneDeletedById(id: string) {
    return await this.repository.findOneDeletedById(id);
  }

  async create(calendar: CreateUserDto) {
    return await this.repository.create(calendar);
  }

  async update(id: string, calendar: UpdateUserDto) {
    return await this.repository.updateById(id, calendar);
  }

  async delete(id: string) {
    return await this.repository.deleteById(id);
  }

  async restore(id: string) {
    return await this.repository.restoreById(id);
  }
}
