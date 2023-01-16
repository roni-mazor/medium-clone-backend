import { Controller, Get, Post } from '@nestjs/common';
import { ArticleService } from './article.service';



@Controller('api/articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }
    @Get()
    async findAll(): Promise<string> {
        return await this.articleService.findAll()
    }

    @Post()
    async createArticle(): Promise<any> {
        return 'create article'
    }

}