import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dtos";
import { Protected, Roles } from "../../decorators/index";
import { UserRole } from "./enums";
import { ApiOperation } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
    constructor(private service: AuthService) { }

    @ApiOperation({ summary: 'Register' })
    @Protected(false)
    @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER])
    @Post('sign-up')
    async signUp(@Body() body: RegisterDto) {
        return await this.service.register(body)
    }
    @ApiOperation({ summary: 'Login' })
    @Protected(false)
    @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER])
    @Post('login')
    async login(@Body() body: LoginDto) {
        return await this.service.login(body)
    }
}