import { connectToDatabase, closeConnection } from '../src/connection.ts';

const esercizio02 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    const users = db.collection('users');
    
    console.log('📝 Esercizio 02: Projections Nested\n');

    // Parte A
    console.log('A) Prodotti con rating medio:\n');
    const ratingProducts = await products.find(
      {},
      {
        projection: {
          name: 1,
          'rating.average': 1,
          'rating.count': 1,
          _id: 0
        }
      }
    ).limit(5).toArray();
    console.log(ratingProducts);

    // Parte B
    console.log('\n\nB) Prodotti con primi 3 tags:\n');
    const tagsProducts = await products.find(
      {},
      {
        projection: {
          name: 1,
          tags: { $slice: 3 },
          _id: 0
        }
      }
    ).limit(5).toArray();
    console.log(tagsProducts);

    // Parte C
    console.log('\n\nC) Utenti con città e stato:\n');
    const customerUsers = await users.find(
      { role: 'customer' },
      {
        projection: {
          'name.first': 1,
          'name.last': 1,
          'address.city': 1,
          'address.state': 1,
          _id: 0
        }
      }
    ).limit(5).toArray();
    console.log(customerUsers);
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await closeConnection();
  }
};

esercizio02();
