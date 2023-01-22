import config from './src/ormconfig';
import { DataSource } from 'typeorm';

const ormseedconfig = {
    ...config,
    migrations: [__dirname + '/src/seeds/*{.ts,.js}'],
    // cli: {
    //     migrationsDir: '/src/seeds'
    // }
}

export default new DataSource(ormseedconfig);
