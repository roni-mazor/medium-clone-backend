import { Body, Controller, Get, Post, UseGuards, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { DeleteResult } from 'typeorm';
import { ArticleService } from './article.service';
import { CreateArticleDto, } from './dto/createArticleDto.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';



@Controller('api/articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }
    @Get()
    async findAll(): Promise<string> {
        return await this.articleService.findAll()
    }

    @Get('/:slug')
    async findArticleBySlug(@Param('slug') slug: string) {
        const article = await this.articleService.findArticleBySlug(slug)
        return this.articleService.buildArticleResponse(article)
    }

    @Delete('/:slug')
    @UseGuards(AuthGuard)
    async removeArticle(@Param('slug') slug: string, @User('id') currentUserId: number): Promise<DeleteResult> {
        return await this.articleService.removeArticle(slug, currentUserId)

    }


    @Post()
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard)
    async createArticle(
        @User() currentUser: UserEntity,
        @Body('article') createArticleDto: CreateArticleDto
    ): Promise<ArticleResponseInterface> {
        const article = await this.articleService.createNewArticle(currentUser, createArticleDto)
        return this.articleService.buildArticleResponse(article)
    }


    @Put('/:slug')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard)
    async updateArticle(
        @User('id') UserId: number,
        @Body('article') updateArticleDto: CreateArticleDto,
        @Param('slug') slug: string
    ): Promise<ArticleResponseInterface> {
        const article = await this.articleService.updateArticle(UserId, updateArticleDto, slug)
        return this.articleService.buildArticleResponse(article)
    }
}