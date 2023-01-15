import { IsNotEmpty, IsEmail } from "class-validator"

export class UpdateUserDto {
    readonly img: string

    @IsNotEmpty()
    @IsEmail()
    readonly email: string

    readonly username: string

    readonly bio: string
}