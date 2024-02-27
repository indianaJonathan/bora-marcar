import { Module, ValidationPipe } from '@nestjs/common';
import { featureModules } from './http';
import { globalModules } from './http/global';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [...globalModules, ...featureModules],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
