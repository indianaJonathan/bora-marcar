import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResetDto } from './dtos/reset.dto';

@ApiTags('Auths')
@Controller('authenticate')
export class AuthsController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @ApiResponse({
    status: 200,
    description: '{ token: "EXAM-PLE" }',
  })
  @ApiResponse({
    status: 401,
    description: '{ code: 401, message: "Not-allowed" }',
  })
  @ApiResponse({
    status: 404,
    description: '{ code: 404, message: "User not found" }',
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

  @ApiResponse({
    status: 200,
    description: '{ token: "EXAM-PLE" }',
  })
  @ApiResponse({
    status: 401,
    description: '{ code: 401, message: "Not-allowed" }',
  })
  @ApiResponse({
    status: 404,
    description: '{ code: 404, message: "User not found" }',
  })
  @Post('/forgot_password')
  async forgotPass(@Body() reset: ResetDto) {
    const user = await this.authService.forgot(reset);

    const payload = {
      email: user.email,
      id: user.id,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: 1000 * 60 * 60 * 48, // 2 days
    });

    return { token };
  }

  @ApiResponse({
    status: 200,
    description: 'Password updated',
  })
  @ApiResponse({
    status: 401,
    description: '{ code: 401, message: "Not-allowed" }',
  })
  @ApiResponse({
    status: 404,
    description: '{ code: 404, message: "User not found" }',
  })
  @Post('/reset_password/:token')
  async resetPass(@Body() reset: ResetDto, @Param('token') token: string) {
    const payload = await this.jwtService.decode(token);

    if (!payload) throw new BadRequestException('Could not decode token');

    const resetInfo = {
      id: payload.id,
      email: payload.email,
      pass: reset.pass,
    };

    return this.authService.reset(resetInfo);
  }
}
