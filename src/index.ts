import express from 'express';
import pkg from 'pg';
import {handleTicket} from './ticket.js';

const {Pool} = pkg;
export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ticket_caisse',
    password: 'hyper',
    port: 5432
});

const app = express();
const port = 3000;

app
    .use(express.raw({type: 'text/plain'}))
    .listen(port, () => console.log(`server running on port : ${port}`))
    .on('error', (error) => console.error(error));

app.post('/ticket', async (request, response): Promise<void> => handleTicket(request, response));
