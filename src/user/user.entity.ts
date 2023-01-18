import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, ManyToMany, JoinTable } from 'typeorm'
import { hash } from 'bcrypt'
import { ArticleEntity } from 'src/article/article.entity'


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

    @Column({ select: false })
    password: string

    @BeforeInsert()
    async hashPassword() {
        const saltRounds = 10
        this.password = await hash(this.password, saltRounds)
    }

    // this is a way to make relations in the db via typeORM
    // oneToMany means that for everyuser there can be multiple articles,not the other way around.
    // first function returns the relationed Entity,and the second returns the property that is relevant
    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[]


    @ManyToMany(() => ArticleEntity)
    @JoinTable()
    favorites: ArticleEntity[]
}