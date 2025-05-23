import Redis from 'ioredis';

// const REDIS_URL=process.env.REDIS_URL|| "redis://localhost:6379";

// export const connection= new Redis(REDIS_URL,{maxRetriesPerRequest:null});
// import { createClient } from 'redis';

export const connection = new Redis({
    password: 'K8lOlaoof4XQbNX1KgP58lWdfq0ZY5KO',
    host: 'redis-11450.c80.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 11450
},{maxRetriesPerRequest:null});