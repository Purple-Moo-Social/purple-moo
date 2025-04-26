import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

ds.initialize()
  .then(() => {
    console.log('Connected successfully!');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ds.destroy();
  })
  .catch((err) => {
    console.error('Connection failed:', err.message);
  });
