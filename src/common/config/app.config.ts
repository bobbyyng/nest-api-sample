import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';
import { ConfigKey } from '../constants/config.constants';

dotenv.config();

export default registerAs(ConfigKey.App, () => ({
  NODEENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  APIDOMAIN: process.env.API_DOMAIN || 'http://localhost',
  CORSORIGIN: process.env.CORS_ORIGIN?.split(',') || '',
  SERCET: process.env.SECRET || 'secret',
  CACHE: process.env.CACHE || true,
}));
