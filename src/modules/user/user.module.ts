import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model';
import { FsHelper } from '../../helper/fs.helper';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: 'test-key',
            signOptions: {
                expiresIn: 600,
            },
        }),
    ],
    controllers: [UserController, AuthController],
    providers: [UserService, FsHelper, AuthService],
})
export class UserModel { }
