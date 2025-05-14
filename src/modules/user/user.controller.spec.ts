import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRole } from './enums';
import { CreateUserDto } from './dtos';

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        getAll: jest.fn().mockResolvedValue([{ id: 1, name: 'User 1' }]),
                        getById: jest.fn().mockResolvedValue({ id: 1, name: 'User 1' }),
                        createUser: jest.fn().mockResolvedValue({ id: 2, name: 'New User' }),
                        updateUser: jest.fn().mockResolvedValue({ id: 1, name: 'Updated User' }),
                        deleteUser: jest.fn().mockResolvedValue({ id: 1, name: 'User 1' }),
                    },
                },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    describe('getAll', () => {
        it('should return an array of users', async () => {
            const result = await userController.getAll({});
            expect(result).toEqual([{ id: 1, name: 'User 1' }]);
            expect(userService.getAll).toHaveBeenCalledWith({});
        });
    });

    describe('getById', () => {
        it('should return a single user', async () => {
            const result = await userController.getById(1);
            expect(result).toEqual({ id: 1, name: 'User 1' });
            expect(userService.getById).toHaveBeenCalledWith(1);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserData: CreateUserDto = { name: 'New User', email: 'newuser@example.com', password: 'password', age: 25 };
            const result = await userController.create(createUserData);
            expect(result).toEqual({ id: 2, name: 'New User' });
            expect(userService.createUser).toHaveBeenCalledWith(createUserData);
        });
    });

    describe('update', () => {
        it('should update an existing user', async () => {
            const updateUserDto = { name: 'Updated User' };
            const result = await userController.update(1, updateUserDto);
            expect(result).toEqual({ id: 1, name: 'Updated User' });
            expect(userService.updateUser).toHaveBeenCalledWith(1, updateUserDto);
        });
    });

    describe('delete', () => {
        it('should delete an existing user', async () => {
            const result = await userController.delete(1);
            expect(result).toEqual({ id: 1, name: 'User 1' });
            expect(userService.deleteUser).toHaveBeenCalledWith(1);
        });
    });
});
