import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./model";
import { FsHelper } from "src/helper/fs.helper";

@Module({
    imports:[SequelizeModule.forFeature([User])],
    controllers:[UserController],
    providers:[UserService,FsHelper]
})
export class UserModel {}