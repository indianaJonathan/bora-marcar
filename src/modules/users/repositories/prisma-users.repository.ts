import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/modules/global/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

import * as bcrypt from 'bcrypt';

const censoredUser = {
  id: true,
  name: true,
  email: true,
  enc_pass: false,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  calendars: false,
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    return await this.prismaService.users.findMany({
      where: { deletedAt: null },
      select: censoredUser,
    });
  }

  async findAllDeleted() {
    return await this.prismaService.users.findMany({
      where: { deletedAt: { not: null } },
      select: censoredUser,
    });
  }

  async findOneById(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: censoredUser,
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOneDeletedById(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
      select: censoredUser,
    });

    if (!user) throw new NotFoundException('Deleted user not found');

    return user;
  }

  async create(user: CreateUserDto) {
    const { name, email, pass } = user;

    const saltRounds = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
    const enc_pass = await bcrypt.hash(pass, saltRounds);

    const formatUser: Prisma.UsersCreateInput = {
      name,
      email,
      enc_pass,
    };

    await this.prismaService.users.create({ data: formatUser });

    return 'User created';
  }

  async updateById(id: string, data: UpdateUserDto) {
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

    const updatedUser = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      select: censoredUser,
    });

    return updatedUser;
  }

  async deleteById(id: string) {
    const user = this.prismaService.users.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: censoredUser,
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

  async restoreById(id: string) {
    const user = this.prismaService.users.findUnique({
      where: {
        id,
        deletedAt: { not: null },
      },
      select: censoredUser,
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
