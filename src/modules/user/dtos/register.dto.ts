import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsEmail } from "class-validator"


export class RegisterDto {
    @ApiProperty({type:String,required:true})
    @IsString()
    name: string

    @ApiProperty({type:String,required:true,default:""})
    @IsEmail()
    email: string

    @ApiProperty({type:String,required:true,default:"12345"})
    @IsString()
    password: string

}