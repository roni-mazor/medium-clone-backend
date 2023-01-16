import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto, } from './dto/createArticleDto.dto';



@Controller('api/articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }
    @Get()
    async findAll(): Promise<string> {
        return await this.articleService.findAll()
    }

    @Post()
    @UseGuards(AuthGuard)
    async createArticle(
        @User() currentUser: UserEntity,
        @Body('article') createArticleDto: CreateArticleDto
    ): Promise<any> {
        return await this.articleService.createNewArticle(currentUser, createArticleDto)
    }

}