import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsInt, Min, Max, IsArray } from 'class-validator';
import { SortOrder, UserRole } from 'src/modules/user/enums';

const acceptedFields = [
    'id',
    'name',
    'age',
    'role',
    'password',
    'createdAt',
    'updatedAt',
    'email',
    'image',
];


export class GetAllUsersDto {
    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        type: 'string',
        enum: UserRole,
        default: UserRole.USER,
        required: false,
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;


    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString()
    sortField?: string;

    @ApiProperty({
        type: 'string',
        enum: SortOrder,
        default: SortOrder.ASC,
        required: false,
    })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder;

    @ApiProperty({ type: 'number', required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ type: 'number', required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiProperty({
        type: "string",
        required: false
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (!value?.length) return acceptedFields
        else {
            const values: string[] = value.split(',')
            const isValid = values.every((el) => acceptedFields.includes(el))
            if (!isValid) {
                throw new BadRequestException(`Xato ustun yuborildi`)
            }
            return values
        }
    })
    @IsArray()
    fileds?: string[]
}
