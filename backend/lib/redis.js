import Redis from 'ioredis';

// const REDIS_URL=process.env.REDIS_URL|| "redis://localhost:6379";

// export const connection= new Redis(REDIS_URL,{maxRetriesPerRequest:null});
// import { createClient } from 'redis';

export const connection = new Redis({
    password: '0BZJdSGqvlKFe8sysOoi8B5xDBfOX43n',
    host: 'redis-14731.c8.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 14731
},{maxRetriesPerRequest:null});