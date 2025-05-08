import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

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
}
