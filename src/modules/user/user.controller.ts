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
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto, UpdateUserDto, UpdateUserImageDto } from './dtos';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Get()
    @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })  
    async getAll() {
      return await this.userService.getAll();
    }
  
    @Get(":id")
    @ApiOperation({ summary: 'ID boyicha foydalanuvchini olish' })  
    async getById(@Param('id', ParseIntPipe) id: number) {
      return await this.userService.getById(id);
    }
  
    @Post()
    @UseInterceptors(FileInterceptor("image"))
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: 'Yangi foydalanuvchi yaratish' }) 
    async create(@Body() body: CreateUserDto, @UploadedFile() image?: Express.Multer.File) {
      return await this.userService.createUser({ ...body, image });
    }
  
    @Patch(":id")
    @ApiOperation({ summary: 'Foydalanuvchini yangilash' }) 
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
      return await this.userService.updateUser(id, body);
    }
  
    @Put('/:id/image')
    @UseInterceptors(FileInterceptor("image"))
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: 'Foydalanuvchi rasmni yangilash' }) 
    async updateImage(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserImageDto, @UploadedFile() image: Express.Multer.File) {
      return await this.userService.updateUserImage(id, image);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Foydalanuvchini ochirish' })  
    async delete(@Param('id', ParseIntPipe) id: number) {
      return await this.userService.deleteUser(id);
    }
  }
  