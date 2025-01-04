import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig();

const config = {
  name: 'default',
  type: 'mysql',
  host: `${process.env.DB_HOST}`,
  port: +process.env.DB_PORT,
  database: `${process.env.DB_DB}`,
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  seeds: ['dist/**/database/seeds/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: true,
  logging: false,
};

console.log('Database Config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DB,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '********' : 'Not Set',
});

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
