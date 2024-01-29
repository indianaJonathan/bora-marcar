import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/global/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserDto } from '../dtos/user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    return await this.prismaService.users.findMany({
      where: { deletedAt: null },
      select: {
        enc_pass: false,
        name: true,
        email: true,
        createdAt: true,
        deletedAt: true,
        id: true,
        calendars: false,
      },
    });
  }

  async findAllDeleted() {
    return await this.prismaService.users.findMany({
      where: { deletedAt: { not: null } },
      select: {
        enc_pass: false,
        name: true,
        email: true,
        createdAt: true,
        deletedAt: true,
        id: true,
        calendars: false,
      },
    });
  }

  async findOneById(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    user['enc_pass'] = undefined;

    return user;
  }

  async findOneDeletedById(id: string): Promise<UserDto> {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
    });

    if (!user) throw new NotFoundException('Deleted user not found');

    return user;
  }

  async create(user: CreateUserDto): Promise<UserDto> {
    const { name, email, pass } = user;
    const formatUser: Prisma.UsersCreateInput = {
      name,
      email,
      enc_pass: pass,
    };

    await this.prismaService.users.create({ data: formatUser });

    return formatUser;
  }

  async updateById(id: string, data: UpdateUserDto): Promise<UserDto> {
    const user = this.prismaService.users.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    for (const key in data) {
      user[key] = data[key];
    }

    await this.prismaService.users.update({
      where: {
        id,
      },
      data,
    });

    return user;
  }

  async deleteById(id: string): Promise<string> {
    const user = this.prismaService.users.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return 'User deleted';
  }

  async restoreById(id: string): Promise<UserDto> {
    const user = this.prismaService.users.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
    });

    if (!user) throw new NotFoundException('Deleted user not found');

    await this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        deletedAt: null,
      },
    });

    return user;
  }
}
