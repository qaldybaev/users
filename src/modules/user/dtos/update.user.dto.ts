import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ type: String, required: false }) 
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ type: Number, required: false })
    @IsOptional()
    @IsNumber()
    age?: number;

    @ApiProperty({ type: String, required: false })
    @IsOptional()
    @IsString()
    password?: string;
}
