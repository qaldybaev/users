import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsEmail } from "class-validator"


export class LoginDto {

    @ApiProperty({type:String,required:true,default:"tom@gmail.com"})
    @IsEmail()
    email: string

    @ApiProperty({type:String,required:true,default:"tom123"})
    @IsString()
    password: string
}