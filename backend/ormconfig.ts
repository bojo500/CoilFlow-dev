import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'coilflow',
  password: process.env.DB_PASSWORD || 'coilflow123',
  database: process.env.DB_NAME || 'coilflow',
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
  logging: false,
});
