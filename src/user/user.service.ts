import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./user.entity";
import { JWT_SECRET } from "src/config";
import { sign } from 'jsonwebtoken'
import { UserResponseInterface } from "./types/userResponse.interface";
import { LoginDto } from "./dto/login.dto";
import { compare } from 'bcrypt'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepositry: Repository<UserEntity>
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepositry.findOne({
            where: { email: createUserDto.email }
        })
        const userByUsername = await this.userRepositry.findOne({
            where: { username: createUserDto.username }
        })
        console.log(userByUsername)
        if (userByUsername) throw new HttpException('Username allready exsists', HttpStatus.UNPROCESSABLE_ENTITY)
        if (userByEmail) throw new HttpException('Email allready exsists', HttpStatus.UNPROCESSABLE_ENTITY)

        const newUser = new UserEntity()
        Object.assign(newUser, createUserDto)
        return await this.userRepositry.save(newUser)
    }

    async login(loginDto: LoginDto): Promise<UserEntity> {
        const userByEmail = await this.userRepositry.findOne({
            where: { email: loginDto.email },
            select: ['id', 'username', 'email', 'password', 'image', 'bio']
        })

        if (!userByEmail) throw new HttpException('Unsigned email', HttpStatus.NOT_FOUND)

        const isPasswordCorrect = await compare(loginDto.password, userByEmail.password)
        if (!isPasswordCorrect) throw new HttpException('Inavlid Password', HttpStatus.NOT_ACCEPTABLE)
        delete userByEmail.password
        return userByEmail
    }



    private generateJwt(user: UserEntity): string {
        return sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, JWT_SECRET)
    }

    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        }
    }
}