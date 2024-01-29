import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/modules/global/prisma/prisma.service';
import { AuthDto } from '../dtos/auth.dto';
import { ResetDto } from '../dtos/reset.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async authenticate(auth: AuthDto) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email: auth.email,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async forgot(reset: ResetDto) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email: reset.email,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async reset(reset: ResetDto) {
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
