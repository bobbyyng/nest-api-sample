import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configurations } from './common/config';

import { WinstonConfigService } from './common/logger/winston.logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configurations],
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // one minute
        limit: 100, // limit each IP to 100 requests per ttl
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
