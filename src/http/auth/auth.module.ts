import { Module } from '@nestjs/common';
import { AuthsController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaAuthRepository } from './repositories/prisma-auth.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [AuthsController],
  providers: [AuthService, PrismaAuthRepository],
})
export class AuthModule {}
