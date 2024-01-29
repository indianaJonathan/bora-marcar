import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersRepository {
  private users: UserDto[] = [];

  findAll(): UserDto[] {
    return this.users.filter((u) => !u.deletedAt);
  }

  findAllDeleted(): UserDto[] {
    return this.users.filter((u) => u.deletedAt);
  }

  findOneById(id: string): UserDto {
    const user = this.users.find((u) => u.id === id && !u.deletedAt);
    return user;
  }
  findOneDeletedById(id: string): UserDto {
    const user = this.users.find((u) => u.id === id && u.deletedAt);
    if (!user) throw new NotFoundException('Deleted user not found');
    return user;
  }

  create(user: CreateUserDto): UserDto {
    const { name, email, pass } = user;
    const id = randomUUID();
    const formatUser: UserDto = {
      id,
      name,
      email,
      enc_pass: pass,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(formatUser);
    return formatUser;
  }

  updateById(id: string, data: UpdateUserDto): UserDto {
    const user = this.users.find((u) => u.id === id && !u.deletedAt);
    if (!user) throw new NotFoundException('User not found');

    for (const key in data) {
      user[key] = data[key];
    }

    user.updatedAt = new Date();

    return user;
  }

  deleteById(id: string): string {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    user.deletedAt = new Date();
    return 'User deleted';
  }

  restoreById(id: string): UserDto {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('Deleted user not found');
    user.deletedAt = null;
    return user;
  }
}
