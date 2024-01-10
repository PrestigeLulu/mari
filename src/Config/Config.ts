import {config} from 'dotenv';

config();

export const TOKEN: string = process.env.TOKEN || '';