import { Injectable } from '@nestjs/common';
import { AuthRepository } from './repositories/prisma-auth.repository';
import { AuthDto } from './dtos/auth.dto';
import { ResetDto } from './dtos/reset.dto';

@Injectable()
export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async authenticate(auth: AuthDto) {
    return await this.repository.authenticate(auth);
  }

  async forgot(reset: ResetDto) {
    return await this.repository.forgot(reset);
  }

  async reset(reset: ResetDto) {
    return await this.repository.reset(reset);
  }
}
