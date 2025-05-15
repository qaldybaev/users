import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model';
import { FsHelper } from '../../helper/fs.helper';
import { UserModel } from './user.module';
import { CreateUserDto } from './dtos';
import { UserRole } from './enums';
import { error } from 'node:console';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const moduleMixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
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
        SequelizeModule.forFeature([User]),
      ],
      providers: [UserService, FsHelper],
    }).compile();

    service = moduleMixture.get<UserService>(UserService);
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await User.sequelize?.close();
  });

  it('Get all users', async () => {
    const data: CreateUserDto = {
      name: 'Ali',
      email: 'ali@gmail.com',
      age: 20,
      password: '1234',
      role: UserRole.ADMIN,
    };

    await service.createUser(data);

    const res = await service.getAll({});

    expect(res.count).toEqual(1);
    expect(res.data).toHaveLength(1);
    expect(res.data[0]).toHaveProperty('id');
  });

  it('create users', async () => {
    const data: CreateUserDto = {
      name: 'Ali',
      email: 'ali@gmail.com',
      age: 20,
      password: '1234',
      role: UserRole.ADMIN,
    };

    try {
      await service.createUser(data);
      await service.createUser(data);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
      expect(error.message).toEqual("Bunday email bilan foydalanuvchi allaqachon mavjud!")
    }

  });


});
