import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  port: parseInt(process.env.REDIS_PORT as string),
  tls: {},
  connectTimeout: 30000,
});