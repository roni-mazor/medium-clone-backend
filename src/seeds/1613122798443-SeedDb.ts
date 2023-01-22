
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1613122798443 implements MigrationInterface {
    name = 'SeedDb1613122798443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner
            .query(`INSERT INTO tags (name) VALUES ('dragons'),('coffee'),('nestjs');`);
        await queryRunner
            .query(`INSERT INTO users (username,email,password) VALUES ('NotMuziRanoon','ro6596@gmail.com','$2b$10$8da8r4.kIevDM3ehwy1IJOKPR3UOz1hHsYzpoLM9z8Ypk4b//zOU.');`);
        await queryRunner
            .query(`INSERT INTO articles (slug,title,description,body,"tagList","authorId") VALUES ('first-article','First-Article','First-Article-description','First-Article-Body','coffe,dragons',1), ('second-article','second-Article','second-Article-description','second-Article-Body','coffe,dragons',1);`);
    }

    public async down(): Promise<void> {
    }

}
