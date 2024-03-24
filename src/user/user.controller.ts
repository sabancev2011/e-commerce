import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/dto.ts';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './dto.ts';
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
    type: UserEntity,
  })
  createUser(@Body() auth: Auth) {
    return this.userService.create(auth)
  }

  @Get('find')
  @ApiOperation({ summary: 'Find' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [UserEntity]
  })
  findUsers() {
    return this.userService.find()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find by id' })
  @ApiOkResponse({
    type: UserEntity
  })
  findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id)
  }

  @Roles(Role.ADMIN)
  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserEntity
  })
  deleteUser(@Param('id', ParseUUIDPipe) id: string, @User() currentUser: JwtPayload) {
    return this.userService.delete(id, currentUser)
  }
}
