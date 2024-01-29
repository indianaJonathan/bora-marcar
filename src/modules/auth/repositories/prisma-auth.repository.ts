import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/modules/global/prisma/prisma.service';
import { AuthDto } from '../dtos/auth.dto';

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
}
