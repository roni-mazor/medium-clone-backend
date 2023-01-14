import { Controller, Get, Post, Body, Request, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateUserDto } from './dto/createUser.dto'
import { LoginDto } from './dto/login.dto'
import { UserResponseInterface } from './types/userResponse.interface'
import { UserService } from './user.service'

@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async Login(@Body('user') loginDto: LoginDto): Promise<UserResponseInterface> {
        const user = await this.userService.login(loginDto)
        return this.userService.buildUserResponse(user)
    }


}