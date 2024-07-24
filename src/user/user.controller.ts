import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAllQueryDto } from './dto/findAll-query.dto';
import { CreateUseService } from './create-user.service';
import { Response } from 'express';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly createUserSvc: CreateUseService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.createUserSvc.execute(createUserDto);
  }

  @Get()
  async findAll(@Query() query: FindAllQueryDto) {
    if (query.email) {
      return await this.userService.findByEmail(query.email as string);
    }

    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    await this.userService.update(id, updateUserDto);
    res.status(200).json({
      message: 'User updated successfully',
      statusCode: 200,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.userService.remove(id);
    res.status(200).json({
      message: 'User deleted successfully',
      statusCode: 200,
    });
  }
}
