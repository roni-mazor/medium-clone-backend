import { UserEntity } from 'src/user/user.entity'
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToOne } from 'typeorm'


@Entity({ name: 'articles' })
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    slug: string

    @Column()
    title: string

    @Column({ default: '' })
    description: string

    @Column({ default: '' })
    body: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date

    @Column('simple-array')
    tagList: string[]

    @Column({ default: 0 })
    favoritesCount: number

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date()
    }

    //same as in users just the other way around.
    // when we save author as an entity,typeOrm knows it is a realtion and not a column of data,
    // and it knows to treat .author just like storing an object in mongodb allthough it is managed as SQL
    // works connected.
    @ManyToOne(() => UserEntity, (user) => user.articles)
    author: UserEntity

}