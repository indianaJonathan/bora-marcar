import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

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
  authenticate(@Body() auth: AuthDto) {
    return this.authService.authenticate(auth);
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
  forgotPass(@Body() reset: ResetDto) {
    return this.authService.forgot(reset);
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
  resetPass(@Body() reset: ResetDto, @Param('token') token: string) {
    return this.authService.reset(reset, token);
  }
}
