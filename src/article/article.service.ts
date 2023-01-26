import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, DeleteResult, Repository, SelectQueryBuilder } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateArticleDto } from './dto/createArticleDto.dto';
import { ArticleEntity } from './article.entity';
import { UserEntity } from 'src/user/user.entity';
import slugify from 'slugify';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponseInterface,interface';
import { GetArticlesQueryParams } from './types/getArticlesQueryParams.interface';
import { FollowEntity } from 'src/profile/follow.entity';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        private readonly dataSource: DataSource,
        @InjectRepository(UserEntity)
        private readonly userRepositry: Repository<UserEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepositry: Repository<FollowEntity>
    ) { }



    async findAll(
        currentUserId: number,
        query: GetArticlesQueryParams
    ): Promise<ArticlesResponseInterface> {
        const queryBuilder = this.dataSource
            .getRepository(ArticleEntity)
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')
        // in the managing proccess of typeORM the authorId column is basicly unavialable to us regularly,
        // but is in use by the ORM so when indicationg author it knows,because it is saved like that in the entity definition.
        // and we need to do the join allthough we have defined it eager:true because this makes a new query without the regular definitions
        // the first arg in leftjoinandselect is the col you want to join by and second arg is basicly defining a variable for future chained methods,
        // to use,if i want to use author[property] this way i can join 
        const articlesCount = await queryBuilder.getCount()
        queryBuilder.orderBy('articles.createdAt', 'DESC')
        await this.createFilterBy(queryBuilder, query)

        const articles = await queryBuilder.getMany()
        let favoriteArticlesIds: number[] = []
        if (currentUserId) {
            const user = await this.userRepositry.findOne({
                where: { id: currentUserId },
                relations: ['favorites']
            })
            favoriteArticlesIds = user.favorites.map(article => article.id)
        }
        const favoritedArticles = articles.map((article) => {
            const favorited = favoriteArticlesIds.includes(article.id)
            return { ...article, favorited }
        })
        return { articles: favoritedArticles, articlesCount }
    }


    async getUserFeed(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
        const follows = await this.followRepositry.find({
            where: { followerId: currentUserId }
        })

        if (!follows.length) return { articles: [], articlesCount: 0 }

        const followingUserIds = follows.map(follow => follow.followingId)
        const queryBuilder = this.dataSource
            .getRepository(ArticleEntity)
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')
            .where('articles.authorId IN (:...followingUserIds)', { followingUserIds })
            .orderBy('articles.createdAt', 'DESC');

        const articlesCount = await queryBuilder.getCount()

        if (query.limit) queryBuilder.limit(query.limit)//how many
        if (query.offset) queryBuilder.offset(query.offset)//from where

        const articles = await queryBuilder.getMany()

        return { articles, articlesCount }
    }

    
    private async createFilterBy(
        queryBuilder: SelectQueryBuilder<ArticleEntity>,
        query: GetArticlesQueryParams,
    ): Promise<void> {
        if (query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', { tag: `%${query.tag}%` })
        }

        if (query.author) {
            const author = await this.userRepositry.findOneBy({ username: query.author })

            queryBuilder.andWhere('articles.authorId = :id', { id: author.id })
        }

        if (query.favorited) {
            const user = await this.userRepositry.findOne({
                where: { username: query.favorited },
                relations: ['favorites']
            })
            if (user && user.favorites.length > 0) {
                const favArticlesIds = user.favorites.map(article => article.id)
                queryBuilder.andWhere('articles.id IN (:...favArticlesIds)', { favArticlesIds })
            } else {
                queryBuilder.andWhere('1=0')
            }

        }

        if (query.limit) queryBuilder.limit(query.limit)//how many
        if (query.offset) queryBuilder.offset(query.offset)//from where
    }

    async createNewArticle(
        currentUser: UserEntity,
        createArticleDto: CreateArticleDto
    ): Promise<ArticleEntity> {
        const newArticle = new ArticleEntity()
        this.articleRepository.merge(newArticle, createArticleDto)

        if (!newArticle.tagList) newArticle.tagList = []
        newArticle.author = currentUser

        newArticle.slug = this.getSlug(createArticleDto.title)

        return await this.articleRepository.save(newArticle)
    }

    async findArticleBySlug(slug: string): Promise<ArticleEntity> {
        const article = await this.articleRepository.findOneBy({ slug })
        if (!article) throw new HttpException('Article does\'nt exsist', HttpStatus.UNPROCESSABLE_ENTITY)
        return article
    }

    async removeArticle(slug: string, userId: number): Promise<DeleteResult> {
        const article = await this.findArticleBySlug(slug)
        if (!article) throw new HttpException('Article does\'nt exsist', HttpStatus.UNPROCESSABLE_ENTITY)

        if (article.author.id !== userId) throw new HttpException('Can only delete self made articles', HttpStatus.FORBIDDEN)

        return this.articleRepository.delete({ id: article.id })

    }

    async updateArticle(
        userId: number,
        updateArticleDto: CreateArticleDto,
        slug: string
    ): Promise<ArticleEntity> {
        const article = await this.findArticleBySlug(slug)
        if (!article) throw new HttpException('Article does\'nt exsist', HttpStatus.UNPROCESSABLE_ENTITY)

        if (article.author.id !== userId) throw new HttpException('Can only update self made articles', HttpStatus.FORBIDDEN)

        if (updateArticleDto.title !== article.title) {
            article.slug = this.getSlug(updateArticleDto.title)
        }

        const updatedArticle = this.articleRepository.merge(article, updateArticleDto)
        return await this.articleRepository.save(updatedArticle)

    }

    async addArticleToFavories(userId: number, slug: string): Promise<ArticleEntity> {
        const article = await this.findArticleBySlug(slug)
        const user = await this.userRepositry.findOne({
            where: { id: userId },
            relations: ['favorites']
        })
        const isFavorited = user.favorites.some((favoritedArticle) => favoritedArticle.id === article.id)
        if (!isFavorited) {
            user.favorites.push(article)
            article.favoritesCount++
            await this.articleRepository.save(article)
            await this.userRepositry.save(user)
        }
        return article
    }

    async removeArticleFromFavories(userId: number, slug: string): Promise<ArticleEntity> {
        const article = await this.findArticleBySlug(slug)
        const user = await this.userRepositry.findOne({
            where: { id: userId },
            relations: ['favorites']
        })

        user.favorites = user.favorites.filter(({ id }) => id !== article.id)
        article.favoritesCount--
        await this.articleRepository.save(article)
        await this.userRepositry.save(user)
        return article
    }


    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article }
    }

    private getSlug(title: string): string {
        return `${slugify(title, { lower: true })}-${(Math.random() * Math.pow(36, 6)).toString(36)}`

    }
}
