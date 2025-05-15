import { UserService } from './user.service';
import { FsHelper } from '../../helper/fs.helper';
import { CreateUserDto, GetAllUsersDto, UpdateUserDto } from './dtos';
import { UserRole } from './enums';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService unit test', () => {
    let service: UserService;
    let userModel: any;
    let fsHelper: FsHelper;

    beforeEach(() => {
        userModel = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        };

        fsHelper = {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
        };

        service = new UserService(userModel, fsHelper);
    });

    it('service defined', () => {
        expect(service).toBeDefined();
    });

    it('getAll', async () => {
        const query: GetAllUsersDto = { limit: 5, page: 1 };
        userModel.findAll.mockResolvedValue([]);

        const res = await service.getAll(query);

        expect(res).toBeInstanceOf(Object);
        expect(res.count).toBe(0);
        expect(res.limit).toEqual(5);
        expect(res.page).toEqual(1);
        expect(res.data).toEqual([]);

    });

    it('createUser - success', async () => {
        const createUserData: CreateUserDto = {
            age: 22,
            name: 'ali',
            email: 'ali@gmail.com',
            password: '1234',
            role: UserRole.ADMIN,
        };

        const passwordHash = bcrypt.hashSync(createUserData.password);
        userModel.findOne.mockResolvedValue(undefined);
        userModel.create.mockResolvedValue({ ...createUserData, password: passwordHash });

        const res = await service.createUser(createUserData);

        expect(res.message).toBe('Yangi foydalanuvchi yaratildi✅');
        expect(res.data).toMatchObject({
            name: createUserData.name,
            email: createUserData.email,
            age: createUserData.age,
            role: createUserData.role,
        });
        expect(res.data.password).toBeTruthy();
    });

    it('createUser - duplicate email', async () => {
        const dto: CreateUserDto = {
            age: 22,
            name: 'ali',
            email: 'ali@gmail.com',
            password: '1234',
            role: UserRole.ADMIN,
        };

        userModel.findOne.mockResolvedValue({ id: 1 });

        await expect(service.createUser(dto)).rejects.toThrow(BadRequestException);
    });

    it('getById - success', async () => {
        const user = { id: 1, name: 'Ali' };
        userModel.findOne.mockResolvedValue(user);

        const res = await service.getById(1);

        expect(res).toEqual({
            message: 'Id boyicha foydalanuchi',
            data: user,
        });
    });

    it('getById - not found', async () => {
        userModel.findOne.mockResolvedValue(null);
        await expect(service.getById(1)).rejects.toThrow(NotFoundException);
    });

    it('updateUser - success', async () => {
        const user = { id: 1, email: 'old@example.com' };
        const updateUserData: UpdateUserDto = {
            name: 'Ali Updated',
            email: 'ali.updated@example.com',
            age: 23,
            password: 'newpassword',
        };

        userModel.findOne.mockResolvedValueOnce(user)
            .mockResolvedValueOnce(null);

        userModel.update.mockResolvedValue([1]);
        userModel.findOne.mockResolvedValue({ ...user, ...updateUserData });

        const res = await service.updateUser(1, updateUserData);

        expect(res.message).toBe('Foydalanuvchi yangilandi✅');
        expect(res.data).toMatchObject({
            name: updateUserData.name,
            email: updateUserData.email,
            age: updateUserData.age,
        });
    });

    it('updateUser - user not found', async () => {
        userModel.findOne.mockResolvedValue(null);
        await expect(service.updateUser(1, {})).rejects.toThrow(NotFoundException);
    });

    it('updateUser - duplicate email', async () => {
        const user = { id: 1, email: 'old@example.com' };
        const dto: UpdateUserDto = { email: 'duplicate@example.com' };

        userModel.findOne
            .mockResolvedValueOnce(user)
            .mockResolvedValueOnce({ id: 2 });

        await expect(service.updateUser(1, dto)).rejects.toThrow(BadRequestException);
    });

    it('updateUserImage - success', async () => {
        const user = { id: 1, dataValues: { image: 'old.jpg' } };
        const image = { originalname: 'new.jpg' } as Express.Multer.File;

        userModel.findOne.mockResolvedValueOnce(user);
        userModel.update.mockResolvedValue([1]);
        userModel.findOne.mockResolvedValueOnce({
            ...user,
            dataValues: { image: 'new.jpg' },
        });

        const res = await service.updateUserImage(1, image);

        expect(res.message).toBe('Foydalanuvchi rasmi yangilandi✅');
        expect(res.data?.dataValues.image).toBe('new.jpg');
    });

    it('updateUserImage - user not found', async () => {
        userModel.findOne.mockResolvedValue(null);
        await expect(service.updateUserImage(1, {} as Express.Multer.File)).rejects.toThrow(NotFoundException);
    });

    it('deleteUser - success', async () => {
        const user = { id: 1, dataValues: { image: 'user.jpg' } };
        userModel.findOne.mockResolvedValue(user);
        userModel.destroy.mockResolvedValue(1);

        const res = await service.deleteUser(1);
        expect(res.message).toBe("Foydalanuvchi o'chirildi ✅");
    });

    it('deleteUser - user not found', async () => {
        userModel.findOne.mockResolvedValue(null);
        await expect(service.deleteUser(1)).rejects.toThrow(NotFoundException);
    });
});
