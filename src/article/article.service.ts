import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateArticleDto } from './dto/createArticleDto.dto';
import { ArticleEntity } from './article.entity';
import { UserEntity } from 'src/user/user.entity';

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
    ): Promise<any> {
        const newArticle = new ArticleEntity()
        this.articleRepository.merge(newArticle, createArticleDto)
        if (!newArticle.tagList) newArticle.tagList = []
        newArticle.author = currentUser
        newArticle.slug = 'Foo'
        return await this.articleRepository.save(newArticle)
    }
}
