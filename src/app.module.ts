import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './modules/user';
import { APP_GUARD } from '@nestjs/core';
import { CheckAuthGuard, CheckRolesGuard } from './guards';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as  path from 'node:path';


@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV?.trim() === "test" ? ".env.test" : ".env",
    isGlobal: true
  }),
  SequelizeModule.forRoot({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    sync: {
      alter: true,
    },
    autoLoadModels: true,
  }),
  ServeStaticModule.forRoot({
    rootPath: path.join(process.cwd(), "uploads"),
    serveRoot: "/uploads"
  }),
    UserModel
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CheckAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CheckRolesGuard,
    }

  ],
})
export class AppModule { }
