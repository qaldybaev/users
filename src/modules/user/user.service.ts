import { Op } from 'sequelize';
import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./model";
import { CreateUserDto, GetAllUsersDto } from "./dtos";
import { FsHelper } from "src/helper/fs.helper";
import { UpdateUserDto } from "./dtos/update.user.dto";
import { SortOrder, UserRole } from "./enums";
import * as bcrypt from "bcryptjs"

@Injectable()

export class UserService implements OnModuleInit {
    constructor(@InjectModel(User) private userModel: typeof User, private fs: FsHelper) { }

    async onModuleInit() {
        await this.#_seedUsers()
    }

    async getAll(query: GetAllUsersDto) {
        const { name, role, sortField, sortOrder, page = 1, limit = 10 } = query;
        const offset = (page - 1) * limit;
      
        const where: Record<string, any> = {}; 
      
        if (name) {
          where.name = { [Op.iLike]: `%${name}%` };
        }
      
        if (role) {
          where.role = role;
        }
      
        const order: [string, SortOrder][] = [];
      
        if (sortField && sortOrder) {
          order.push([sortField, sortOrder]);
        }
      
        const users = await this.userModel.findAll({
          where,
          limit,
          offset,
          order: order.length ? order : undefined,
        });
      
        return {
          message: "Barcha foydalanuvchilar",
          count: users.length,
          page,
          limit,
          data: users,
        };
      }

    async getById(id: number) {
        const user = await this.userModel.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`ID: ${id} boyicha foudalanuvchi topilmadi!`);
        }
        return {
            message: "Id boyicha foydalanuchi",
            data: user
        }
    }

    async createUser(payload: CreateUserDto) {

        const fileName = payload.image ? await this.fs.uploadFile(payload.image) : null;
        const fileUrl = fileName?.fileUrl.split("\\").at(-1)
        const passwordHash = bcrypt.hashSync(payload.password);
        const newUser = await this.userModel.create(
            {
                name: payload.name,
                email: payload.email,
                age: payload.age,
                password: passwordHash,
                image: fileUrl,
                role: payload.role,

            })
        return {
            message: "Yangi foydalanuvchi yaratildi✅",
            data: newUser
        }
    }

    async updateUser(id: number, payload: UpdateUserDto) {
        const user = await this.userModel.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`ID: ${id} boyicha foudalanuvchi topilmadi!`);
        }

        const updatedUserData: any = {};

        if (payload.name) updatedUserData.name = payload.name;
        if (payload.email) updatedUserData.email = payload.email;
        if (payload.age) updatedUserData.age = payload.age;
        if (payload.password) {
            const passwordHash = bcrypt.hashSync(payload.password);
            updatedUserData.password = passwordHash;
        }
        await this.userModel.update(updatedUserData, { where: { id } });

        const updatedUser = await this.userModel.findOne({ where: { id } });
        return {
            message: "Foydalanuvchi yangilandi✅",
            data: updatedUser
        };

    }

    async updateUserImage(id: number, image: Express.Multer.File) {
        const user = await this.userModel.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`ID: ${id} boyicha foydalanuvchi topilmadi!`);
        }


        if (user?.dataValues?.image) {
            await this.fs.deleteFile(user?.dataValues?.image);

        }

        const fileName = await this.fs.uploadFile(image);
        const fileUrl = fileName?.fileUrl.split("\\").at(-1);

        await this.userModel.update({ image: fileUrl }, { where: { id } });

        const updatedUserImage = await this.userModel.findOne({ where: { id } });

        return {
            message: "Foydalanuvchi rasmi yangilandi✅",
            data: updatedUserImage
        };
    }


    async deleteUser(id: number) {
        const user = await this.userModel.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`ID: ${id} bo'yicha foydalanuvchi topilmadi!`);
        }

        if (user?.dataValues?.image) {
            await this.fs.deleteFile(user?.dataValues?.image);

        }

        await this.userModel.destroy({ where: { id } });

        return {
            message: "Foydalanuvchi o'chirildi ✅",
        };
    }

    async #_seedUsers() {
        const users = [
            {
                name: 'Tom',
                email: 'tom@gmail.com',
                password: 'tom123',
                role: UserRole.SUPER_ADMIN,
            },
        ];

        for (let user of users) {
            const newUser = await this.userModel.findOne({ where: { email: user.email } });

            if (!newUser) {
                const passwordHash = bcrypt.hashSync(user.password);
                await this.userModel.create({
                    name: user.name,
                    email: user.email,
                    password: passwordHash,
                    role: user.role,
                });
            }
        }

        console.log('Adminlar yaratildi ✅');
    }

}