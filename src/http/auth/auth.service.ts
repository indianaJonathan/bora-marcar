import { JwtService } from '@nestjs/jwt';

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaAuthRepository } from './repositories/prisma-auth.repository';
import { AuthDto } from './dtos/auth.dto';
import { ResetDto } from './dtos/reset.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: PrismaAuthRepository,
    private readonly jwtService: JwtService
  ) {}

  authenticate(auth: AuthDto) {
    return this.repository.authenticate(auth);
  }

  forgot(reset: ResetDto) {
    return this.repository.forgot(reset);
  }

  async reset(reset: ResetDto, token: string) {
    const isTokenValid = await this.jwtService.verifyAsync(token);

    if (!isTokenValid) throw new BadRequestException('Token not valid!');

    const payload = await this.jwtService.decode(token);

    if (!payload) throw new BadRequestException('Could not decode token');

    const resetInfo = {
      id: payload.id,
      email: payload.email,
      pass: reset.pass,
    };

    return await this.repository.reset(resetInfo, token);
  }
}
