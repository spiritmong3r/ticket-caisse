import {PoolClient} from 'pg';
import {pool} from '../index.js';

/**
 * Wrapper permettant d'exécuter des requêtes SQL dans une transaction.
 *
 * @param callback Le(s) requête(s) à exécuter.
 */
export default async (callback: (client: PoolClient) => Promise<any>): Promise<void> => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        try {
            await callback(client);
            await client.query('COMMIT');
        } catch (error) {
            console.error(error);
            await client.query('ROLLBACK');
        }
    } finally {
        client.release();
    }

}
