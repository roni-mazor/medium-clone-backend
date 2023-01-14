import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
const config: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    username: 'mediumclone',
    password: '123',
    database: 'mediumclone',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    migrationsRun: true,
}

export default config