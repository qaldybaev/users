import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dtos";
import { Protected, Roles } from "src/decorators";
import { UserRole } from "./enums";

@Controller("auth")
export class AuthController {
    constructor(private service: AuthService) { }

    @Protected(false)
    @Roles([UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.USER])
    @Post('sign-up')
    async signUp(@Body() body: RegisterDto) {
        return await this.service.register(body)
    }

    @Protected(false)
    @Roles([UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.USER])
    @Post('login')
    async login(@Body() body: LoginDto) {
        return await this.service.login(body)
    }
}