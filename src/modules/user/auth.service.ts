import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from './model';
import { LoginDto, RegisterDto } from './dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        private jwtService: JwtService,
    ) { }

    async register(payload: RegisterDto) {
        await this.#_checkExistingUserByEmail(payload.email);

        const passwordHash = await bcrypt.hash(payload.password, 10);
        const user = await this.userModel.create({
            name: payload.name,
            email: payload.email,
            password: passwordHash,
        });
        const role = user.dataValues.role
        const accessToken = this.jwtService.sign({ id: user.dataValues.id, role: role })

        return {
            message: "Muvaffaqiyatli kirildi",
            data: {
                accessToken,
                user
            }
        }
    }

    async login(payload: LoginDto) {
        const user = await this.#_checkUserByEmail(payload.email)

        const isUserMatch = bcrypt.compareSync(payload.password, user.dataValues.password)

        if (!isUserMatch) {
            throw new ConflictException('Parol xato kiritildi')
        }

        const role = user.dataValues.role
        const accessToken = this.jwtService.sign({ id: user.id, role: role })

        return {
            message: "Muvaffaqiyatli kirildi",
            data: {
                accessToken,
                user
            }
        }
    }

    async #_checkExistingUserByEmail(email: string) {
        const user = await this.userModel.findOne({ where: { email } });

        if (user) {
            throw new ConflictException(
                `Bunday email'lik foydalanuvchi allaqachon mavjud`,
            );
        }
    }

    async #_checkUserByEmail(email: string) {
        const user = await this.userModel.findOne({ where: { email } });

        if (!user) {
            throw new ConflictException(
                `Bunday email'lik foydalanuvchi yoq`,
            );
        }
        return user
    }

}
