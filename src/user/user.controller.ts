import { Controller, Get, Post, Body, UsePipes, UseGuards, ValidationPipe, Req, Res, Next, Put } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { ExpressRequest } from 'src/types/expressRequest.interface'
import { User } from './decorators/user.decorator'
import { CreateUserDto } from './dto/createUser.dto'
import { LoginDto } from './dto/login.dto'
import { UpdateUserDto } from './dto/updateUserDto.dto'
import { AuthGuard } from './guards/auth.guard'
import { UserResponseInterface } from './types/userResponse.interface'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'

@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(
        @Body('user') createUserDto: CreateUserDto
    ): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async Login(
        @Body('user') loginDto: LoginDto
    ): Promise<UserResponseInterface> {
        const user = await this.userService.login(loginDto)
        return this.userService.buildUserResponse(user)
    }

    @Put()
    @UsePipes(new ValidationPipe()) // important to use this validation pipe or else the dto class wont take into affect
    @UseGuards(AuthGuard)
    async updateCurrentUser(
        @Body('user') updateUserDto: UpdateUserDto,
        @User('id') userId: number
    ): Promise<UserResponseInterface> {
        const user = await this.userService.updateUser(userId, updateUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Get()
    @UseGuards(AuthGuard)
    async currentUser(
        @User() user: UserEntity
    ):
        Promise<UserResponseInterface> {
        return this.userService.buildUserResponse(user)
    }

}