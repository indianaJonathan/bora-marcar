import { Module } from '@nestjs/common';
import { AuthsController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repositories/prisma-auth.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [AuthsController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
