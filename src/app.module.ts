import { RouterModule } from '@nestjs/core';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppService } from './app.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/typeorm';
import { LoggerMiddleware } from './logger.middleware';
import { AdminsApp } from './admins/admins-app.module';
import { UsersApp } from './users/users-app.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production'],
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/api/v1/public',
      rootPath: join(__dirname, '..', 'public'),
    }),
    AdminsApp,
    UsersApp,
    RouterModule.register([
      {
        path: 'admins',
        module: AdminsApp,
      },
      {
        path: 'users',
        module: UsersApp,
      },
    ]),
  ],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
