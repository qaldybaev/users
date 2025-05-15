import { ConfigModule } from "@nestjs/config";
import { UserController } from "./user.controller"
import { SequelizeModule } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "./model";
import { UserService } from "./user.service";
import { FsHelper } from "../../helper/fs.helper";
import { CreateUserDto } from "./dtos";
import { UserRole } from "./enums";

describe("UserController", () => {
    let controller: UserController

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
            controllers: [UserController],
            providers: [UserService, FsHelper],
        }).compile();

        controller = moduleMixture.get<UserController>(UserController);
    });

    beforeEach(async () => {
        await User.destroy({ where: {}, truncate: true, cascade: true });
    });

    afterAll(async () => {
        await User.sequelize?.close();
    });

    it('GET/ users', async () => {
        const data: CreateUserDto = {
            name: 'Ali',
            email: 'ali@gmail.com',
            age: 20,
            password: '1234',
            role: UserRole.ADMIN,
        };

        await controller.create(data)

        const res = await controller.getAll({})

        expect(res.count).toEqual(1)
    })

})