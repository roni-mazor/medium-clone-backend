import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateArticleDto } from './dto/createArticleDto.dto';
import { ArticleEntity } from './article.entity';
import { UserEntity } from 'src/user/user.entity';
import slugify from 'slugify';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>
    ) { }

    async findAll(): Promise<string> {
        return 'Articles'
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


    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article }
    }

    private getSlug(title: string): string {
        return `${slugify(title, { lower: true })}-${(Math.random() * Math.pow(36, 6)).toString(36)}`

    }
}
