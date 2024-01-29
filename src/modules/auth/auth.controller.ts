import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auths')
@Controller('authenticate')
export class AuthsController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @ApiResponse({
    status: 200,
    description: '{ token: "EXAM-PLE", expiresAt: "2024-01-01T00:00:00" }',
  })
  @ApiResponse({
    status: 401,
    description: '{ code: 401, message: "Not-allowed" }',
  })
  @Post()
  async authenticate(@Body() auth: AuthDto) {
    const user = await this.authService.authenticate(auth);

    const isMatch = await bcrypt.compare(auth.pass, user.enc_pass);

    if (!isMatch) throw new UnauthorizedException('Wrong password');

    const payload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: 1000 * 60 * 60 * 48, // 2 days
    });

    return { token };
  }
}
