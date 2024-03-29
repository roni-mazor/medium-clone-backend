import { IsNotEmpty, IsEmail } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @IsEmail()
    readonly email: string


    @IsNotEmpty()
    readonly password: string
}