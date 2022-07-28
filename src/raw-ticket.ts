import {pool} from './index.js';

export interface RawTicket {

    id: number;

    text: string;

}

/**
 * Enregistre en BDD le texte d'un ticket.
 *
 * @param rawTicket Le texte du ticket.
 * @return Une promesse contenant un {@link RawTicket}.
 */
export const saveRawTicket = async (rawTicket: string): Promise<RawTicket> => {
    const {rows} = await pool.query('INSERT INTO raw_ticket (text) VALUES ($1) RETURNING *', [rawTicket]);
    return rows[0];
};
