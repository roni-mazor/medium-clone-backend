import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./user.entity";


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepositry: Repository<UserEntity>
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const newUser = new UserEntity()
        Object.assign(newUser, createUserDto)
        return await this.userRepositry.save(newUser)
    }
}