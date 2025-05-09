import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { SortOrder, UserRole } from 'src/modules/user/enums';


export class GetAllUsersDto {
    @ApiProperty( {type: 'string', required: false})
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


    @ApiProperty( {type: 'string', required: false})
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

    @ApiProperty( {type: 'number', required: false})
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiProperty( {type: 'number', required: false})
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;
}
