import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { UserRole } from "../enums";

export class CreateUserDto {
    @ApiProperty({ type: String, default: "Nurken" })
    @IsString()
    name: string;

    @ApiProperty({ type: String, default: "nurken@example.com" })
    @IsString()
    email: string;

    @ApiProperty({ type: Number, default: 24 })
    @IsNumber()
    age: number;

    @ApiProperty({ type: String, default: "123456" })
    @IsString()
    password: string;

    @ApiProperty({ type: String, format: "binary", required: false })
    @IsOptional()
    image?: Express.Multer.File;

    @ApiProperty({
        type: 'string',
        enum: UserRole,
        default: UserRole.USER,
        required: false,
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
