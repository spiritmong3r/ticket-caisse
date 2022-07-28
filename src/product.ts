import {PoolClient} from 'pg';

export interface Product {

    id: string;

    price: number;

    label: string;

}

/**
 * Enregistre en BDD des objets {@link Product}.
 *
 * @param products Les produits à enregistrer.
 * @param client La connexion à la BDD.
 * @return Une promesse contenant une liste de {@link Product}.
 */
export const saveProduct = async (products: Product[], client: PoolClient): Promise<Product[]> => {
    const savedProducts: Product[] = [];

    for (const product of products) {
        // Vérification de l'existance des products mise en commentaire pour le load testing
        // const existingProduct = await client.query('SELECT 1 FROM product WHERE id = $1 LIMIT 1', [product.id]);
        // if (!existingProduct.rows[0]) {
        const {rows} = await client.query('INSERT INTO product (id, label, price) VALUES ($1, $2, $3) RETURNING *', [product.id, product.label, product.price]);
        savedProducts.push(rows[0]);
        // }
    }

    return savedProducts;
};
