import { Injectable } from '@nestjs/common';
import { AuthRepository } from './repositories/prisma-auth.repository';
import { AuthDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async authenticate(auth: AuthDto) {
    return await this.repository.authenticate(auth);
  }
}
