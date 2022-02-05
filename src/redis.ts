import Redis from "ioredis";

export const redis = new Redis({
  host: "localhost",
  // username: process.env.REDIS_USERNAME,
  // password: process.env.REDIS_PASSWORD,
  port: 6379,
  // tls: {},
  // connectTimeout: 30000,
});