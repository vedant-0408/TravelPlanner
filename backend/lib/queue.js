import {Queue} from 'bullmq';
import {connection} from './redis.js';

export const jobsQueue = new Queue("jobsQueue",{
    connection,
    defaultJobOptions:{
        attempts:2,
        backoff:{
            type:"exponential",
            delay:5000,
        }
    }
})