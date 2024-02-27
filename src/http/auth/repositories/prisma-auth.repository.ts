import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/http/global/prisma/prisma.service';
import { AuthDto } from '../dtos/auth.dto';
import { ResetDto } from '../dtos/reset.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async authenticate(auth: AuthDto) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email: auth.email,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const validatePass = await bcrypt.compare(auth.pass, user.enc_pass);

    if (!validatePass) throw new ForbiddenException('Wrong password');

    const payload = {
      id: user.id,
      email: user.email,
    }

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 48, // 2 days
      secret: process.env.JWT_SECRET,
    });

    return { token };
  }

  async forgot(reset: ResetDto) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email: reset.email,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const payload = {
      id: user.id,
    }

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24, // 1 day
    });

    return { token };
  }

  async reset(reset: ResetDto, token: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id: reset.id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const saltRounds = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
    const enc_pass = await bcrypt.hash(reset.pass, saltRounds);

    await this.prismaService.users.update({
      where: {
        id: user.id,
      },
      data: {
        enc_pass,
      },
    });

    return 'User updated';
  }
}
