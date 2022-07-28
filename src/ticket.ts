import {parse} from 'csv-parse/sync';
import {Request, Response} from 'express';
import {PoolClient} from 'pg';
import {Product, saveProduct} from './product.js';
import {saveRawTicket} from './raw-ticket.js';
import transaction from './utils/transaction.js';

export interface Ticket {

    order: number;

    vat: number;

    total: number;

    products: Product[];

}

/**
 * Transforme le ticket reçu sous forme de texte en objet {@link Ticket}.
 *
 * @param rawTicket Le ticket tel qu'il est reçu, sous forme de chaine de caractères.
 * @return Un object {@link Ticket} ou `undefined` s'il y a un souci au moment du parsing.
 */
export const ticketParser = (rawTicket: string): Ticket | undefined => {
    try {
        const values = rawTicket.split('\n');

        const order = Number(values[0].split(':')[1].trim());
        const vat = Number(values[1].split(':')[1].trim());
        const total = Number(values[2].split(':')[1].trim());

        // Récupération des lignes au format csv sous forme de chaine de caractères ...
        const csv = values.slice(4, values.length).map((value: string) => value.trim()).join('\n');
        // ... puis transformation du csv en objet js ...
        const records = parse(csv, {columns: true, skip_empty_lines: true});
        // ... et enfin à partir de ce dernier, on construit le(s) objet(s) 'Product'
        const products = records.map((record: any) => ({id: record.product_id, price: Number(record.price), label: record.product}));

        return {order, vat, total, products};
    } catch (error) {
        // On catch les éventuelles erreurs de parsing dû au mauvais formatage du ticket pour pouvoir continuer le traitement
        return undefined;
    }
};

/**
 * Détermine si un ticket et ses products sont valides ou non.
 *
 * @param ticket Le ticket et les products associés.
 * @return `true` si toutes les données du ticket et des products sont renseignées, `false` sinon.
 */
export const ticketValidator = (ticket: Ticket | undefined): boolean => {
    let isValid = false;

    if (ticket) {
        const isTicketValid = ticket.order && ticket.vat && ticket.total;
        const areProductsValid = ticket.products.every(product => product.id && product.label && product.price);
        isValid = isTicketValid && areProductsValid;
    }

    return isValid;
};

/**
 * Enregistre en BDD un objet {@link Ticket}.
 *
 * @param ticket Le ticket à enregistrer en BDD.
 * @param rawTicketId L'identifiant du rawTicket associé.
 * @param client La connexion à la BDD.
 * @return Une promesse contenant un {@link Ticket}.
 */
export const saveTicket = async (ticket: Ticket, rawTicketId: number, client: PoolClient): Promise<Ticket> => {
    // Vérification de l'existance du ticket mise en commentaire pour le load testing
    // const existingTicket = await client.query('SELECT 1 FROM ticket WHERE num_order = $1 LIMIT 1', [ticket.order]);
    // if (!existingTicket.rows[0]) {
    const {rows} = await client.query('INSERT INTO ticket (num_order, vat, total, raw_ticket_id) VALUES ($1, $2, $3, $4) RETURNING *', [ticket.order, ticket.vat, ticket.total, rawTicketId]);
    return rows[0];
    // }
};

/**
 * Parse le ticket reçu en objet puis l'enregistre en BDD.
 *
 * @param request La requête http.
 * @param response La réponse.
 */
export const handleTicket = async (request: Request, response: Response): Promise<void> => {
    const rawTicket = request.body.toString();

    const {id} = await saveRawTicket(rawTicket);

    const ticket = ticketParser(rawTicket);
    const isValid = ticketValidator(ticket);

    if (isValid) {
        await transaction(async (client) => {
            await saveTicket(ticket, id, client);
            await saveProduct(ticket.products, client);
        });
    }

    response.send(ticket);
};
