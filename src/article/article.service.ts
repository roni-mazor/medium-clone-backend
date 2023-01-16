import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ArticleService {
    constructor(
        // @InjectRepository(ArticleEntity)
        // private readonly articleRepository: Repository<ArticleEntity>
    ) { }

    async findAll(): Promise<string> {
        return 'Articles'
    }
}
