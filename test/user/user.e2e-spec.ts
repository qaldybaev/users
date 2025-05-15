import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { FsHelper } from '../../src/helper/fs.helper';
import * as request from 'supertest';
import { User, UserModel, UserService } from '../../src/modules/user';
import { CreateUserDto } from '../../src/modules/user/dtos';
import { UserRole } from '../../src/modules/user/enums';
import * as path from 'node:path';

describe('User e2e', () => {
    let app: INestApplication;
    let sequelize: Sequelize;

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
                UserModel,
            ],
            providers: [UserService, FsHelper],
        }).compile();

        app = moduleMixture.createNestApplication();
        await app.init();

        sequelize = app.get<Sequelize>(Sequelize);
    });

    beforeEach(async () => {
        await User.destroy({ where: {}, cascade: true, truncate: true });
    });

    afterEach(async () => {
        await User.destroy({ where: {}, cascade: true, truncate: true });
    });

    afterAll(async () => {
        await User.sequelize?.close();
        if (sequelize) {
            await sequelize.close();
        }
        await app.close();
    });

    it('POST /users - should create user', async () => {
        const data: CreateUserDto = {
            name: 'Ali',
            email: 'ali@gmail.com',
            age: 20,
            password: '1234',
            role: UserRole.ADMIN,
        };

        const res = await request(app.getHttpServer())
            .post('/users')
            .send(data)
            .expect(201);

        expect(res.body).toMatchObject({
            message: 'Yangi foydalanuvchi yaratildi✅',
        });
    });

    it("GET /users barcha userlani olish", async () => {
        const data: CreateUserDto = {
            name: 'Ali',
            email: 'ali@gmail.com',
            age: 20,
            password: '1234',
            role: UserRole.ADMIN,
        };

        await request(app.getHttpServer())
            .post('/users')
            .send(data)
            .expect(201);

        const getAll = await request(app.getHttpServer())
            .get("/users")
            .expect(200)
        expect(getAll.body).toHaveProperty('message', 'Barcha foydalanuvchilar');
    })

    it("GET /users/:id id boyicha userni olish", async () => {
        const data: CreateUserDto = {
            name: 'Ali',
            email: 'ali@gmail.com',
            age: 20,
            password: '1234',
            role: UserRole.ADMIN,
        };

        const res = await request(app.getHttpServer())
            .post('/users')
            .send(data)
            .expect(201);

        const userId = res.body.data.id

        const getById = await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .expect(200)
        expect(getById.body).toHaveProperty('message', 'Id boyicha foydalanuchi');
    })

    it('PATCH /users/:id - foydalanuvchini qisman yangilaydi', async () => {

        const data: CreateUserDto = {
            name: 'Ali',
            email: 'ali@gmail.com',
            age: 20,
            password: '1234',
            role: UserRole.ADMIN,
        };

        const res = await request(app.getHttpServer())
            .post('/users')
            .send(data)
            .expect(201);

        const userId = res.body.data.id

        const updateData = {
            name: 'Tom',
            email: 'tom@example.com',
            age: 35,
            password: 'tom123',
        };

        const updatedUser = await request(app.getHttpServer())
            .patch(`/users/${userId}`)
            .send(updateData)
            .expect(200);

        expect(updatedUser.body).toHaveProperty('message', 'Foydalanuvchi yangilandi✅');
        expect(updatedUser.body).toHaveProperty('data');
        expect(updatedUser.body.data).toMatchObject({
            id: userId,
            name: 'Tom',
            email: 'tom@example.com',
            age: 35,
        });
    });

    it('PUT /users/:id/image - foydalanuvchi resmini yaratish', async () => {
        const data: CreateUserDto = {
            name: 'Ali',
            email: 'ali@gmail.com',
            age: 20,
            password: '1234',
            role: UserRole.ADMIN,
        };
        const res = await request(app.getHttpServer())
            .post('/users')
            .send(data)
            .expect(201);

        const userId = res.body.data.id;

        const imagePath = path.join(process.cwd(), 'test', 'test-file', 'user.png');

        const response = await request(app.getHttpServer())
            .put(`/users/${userId}/image`)
            .attach("image", imagePath)
            .expect(200);

        expect(response.body).toMatchObject({
            message: "Foydalanuvchi rasmi yangilandi✅"
        })
    });

    it('DELETE /users/:id - foydalanuvchini o\'chirish', async () => {
        const data: CreateUserDto = {
            name: 'Ali',
            email: 'ali@gmail.com',
            age: 20,
            password: '1234',
            role: UserRole.ADMIN,
        };


        const res = await request(app.getHttpServer())
            .post('/users')
            .send(data)
            .expect(201);

        const userId = res.body.data.id;

        const deleteRes = await request(app.getHttpServer())
            .delete(`/users/${userId}`)
            .expect(200);

        expect(deleteRes.body).toMatchObject({
            message: 'Foydalanuvchi o\'chirildi ✅'
        });

        await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .expect(404);
    });

});
