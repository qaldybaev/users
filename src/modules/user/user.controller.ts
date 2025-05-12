import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Delete,
  UploadedFile,
  UseInterceptors,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, GetAllUsersDto, UpdateUserDto, UpdateUserImageDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Protected, Roles } from 'src/decorators';
import { UserRole } from './enums';
import { CheckFileSizePipe } from 'src/pipes';
import { CheckFilePathPipe } from 'src/pipes/check-file-path.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @Protected(true)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  async getAll(@Query() query: GetAllUsersDto) {
    return await this.userService.getAll(query);
  }

  @Get(":id")
  @Protected(true)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ID boyicha foydalanuvchini olish' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getById(id);
  }

  @Post()
  @Protected(true)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("image"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: 'Yangi foydalanuvchi yaratish' })
  async create(@Body() body: CreateUserDto, @UploadedFile(new CheckFilePathPipe(["png", "jpg", "jpeg"]), new CheckFileSizePipe(2)) image?: Express.Multer.File) {
    return await this.userService.createUser({ ...body, image });
  }

  @Patch(":id")
  @Protected(true)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchini yangilash' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return await this.userService.updateUser(id, body);
  }

  @Put('/:id/image')
  @Protected(true)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("image"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: 'Foydalanuvchi rasmni yangilash' })
  async updateImage(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserImageDto, @UploadedFile(new CheckFilePathPipe(["png", "jpg", "jpeg"]), new CheckFileSizePipe(1)) image: Express.Multer.File) {
    return await this.userService.updateUserImage(id, image);
  }

  @Delete(':id')
  @Protected(true)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchini ochirish' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUser(id);
  }
}
