import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'
import {  hash } from 'bcrypt'


@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    email: string

    @Column({ default: '' })
    bio: string

    @Column({ default: '' })
    image: string

    @Column()
    password: string

    @BeforeInsert()
    async hashPassword() {
        const saltRounds = 10
        this.password = await hash(this.password, saltRounds)
    }

}