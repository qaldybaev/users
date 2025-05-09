import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { SortOrder, UserRole } from 'src/modules/user/enums';


export class GetAllUsersDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name?: string;
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty()
    @IsOptional()
    @IsString()
    sortField?: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;
}
