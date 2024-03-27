import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserCreateModel, UserModel, UserUpdateModel } from './dto.ts';
import { ResponsePayloadSanitizationInterceptor } from 'src/interceptors';
import { Roles, User } from 'src/decorators';
import { JwtPayload } from 'src/interfaces';
import { Role } from '@prisma/client';

@ApiTags('user-controller')
@UseInterceptors(ResponsePayloadSanitizationInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('create')
  @ApiOperation({ summary: 'Create' })
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    type: UserModel,
  })
  createUser(@Body() user: UserCreateModel) {
    return this.userService.create(user)
  }

  @Get('find')
  @ApiOperation({ summary: 'Find' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [UserModel]
  })
  findUsers() {
    return this.userService.find()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find by id' })
  @ApiOkResponse({
    type: UserModel
  })
  findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id)
  }

  @Put(':id/update')
  @ApiOperation({ summary: 'Update' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserModel
  })
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserModel: UserUpdateModel) {
    return this.userService.update(id, updateUserModel)
  }

  @Roles(Role.ADMIN)
  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserModel
  })
  deleteUser(@Param('id', ParseUUIDPipe) id: string, @User() currentUser: JwtPayload) {
    return this.userService.delete(id, currentUser)
  }
}
