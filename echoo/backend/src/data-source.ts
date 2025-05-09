//src\data-source.ts
import { DataSource } from 'typeorm';
// import { User } from './users/user.entity';
import 'dotenv/config';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  schema: 'public',
});
