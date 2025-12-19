import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { News } from '../../modules/news/entities/news.entity';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'noticias_db',
  entities: [News],
  migrations: ['src/common/database/migrations/*.ts'],
  synchronize: false,
});

export default dataSource;
