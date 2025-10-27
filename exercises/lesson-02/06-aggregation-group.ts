import { connectToDatabase, closeConnection } from '../../utils/connection.js';

const esercizio06 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    const orders = db.collection('orders');

    console.log('📝 Esercizio 06: $group\n');

    // A
    console.log('A) Count per categoria:\n');
    const resA = await products.aggregate([
      { $group: { _id: '$category', total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]).toArray();
    console.log(resA);

    // B
    console.log('\n\nB) Prezzo medio per categoria:\n');
    const resB = await products.aggregate([
      { $match: { status: 'active' } },
      { $group: {
        _id: '$category',
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        totalProducts: { $sum: 1 }
      }},
      { $sort: { avgPrice: -1 } }
    ]).toArray();
    console.log(resB);

    // C
    console.log('\n\nC) Statistiche globali:\n');
    const resC = await products.aggregate([
      { $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        totalInventoryValue: { $sum: { $multiply: ['$price', '$stock'] } }
      }}
    ]).toArray();
    console.log(resC);

    // D
    console.log('\n\nD) Revenue per status:\n');
    const resD = await orders.aggregate([
      { $group: {
        _id: '$status',
        totalRevenue: { $sum: '$total' },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: '$total' }
      }},
      { $sort: { totalRevenue: -1 } }
    ]).toArray();
    console.log(resD);

    // E
    console.log('\n\nE) Brands per categoria:\n');
    const resE = await products.aggregate([
      { $match: { brand: { $exists: true, $ne: null } } },
      { $group: { _id: '$category', brands: { $addToSet: '$brand' } } }
    ]).toArray();
    console.log(resE);

  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await closeConnection();
  }
};

esercizio06();
