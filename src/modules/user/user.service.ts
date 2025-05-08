import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./model";
import { CreateUserDto } from "./dtos";
import { FsHelper } from "src/helper/fs.helper";
import { UpdateUserDto } from "./dtos/update.user.dto";

@Injectable()

export class UserService {
    constructor(@InjectModel(User) private userModel: typeof User, private fs: FsHelper) { }

    async getAll() {
        const users = await this.userModel.findAll();
        return {
            message: "Barcha foydalanuvchilar",
            count: users.length,
            data: users
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
        const newUser = await this.userModel.create(
            {
                name: payload.name,
                email: payload.email,
                age: payload.age,
                password: payload.password,
                image: fileUrl

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
        if (payload.password) updatedUserData.password = payload.password;

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
    
}