import { connectToDatabase, closeConnection } from '../../utils/connection.js';

const esercizio05 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    const users = db.collection('users');
    
    console.log('📝 Esercizio 05: $match e $project\n');

    // A
    console.log('A) $match - Electronics < $500:\n');
    const resA = await products.aggregate([
      { $match: { category: 'Electronics', price: { $lt: 500 } } },
      { $limit: 5 }
    ]).toArray();
    console.log(resA);

    // B
    console.log('\n\nB) $project - Nome e prezzo attivi:\n');
    const resB = await products.aggregate([
      { $match: { status: 'active' } },
      { $project: { name: 1, price: 1, _id: 0 } }
    ]).toArray();
    console.log(resB);

    // C
    console.log('\n\nC) $project - Prezzo scontato:\n');
    const resC = await products.aggregate([
      { $match: { price: { $gte: 100 } } },
      { $project: {
          name: 1,
          originalPrice: '$price',
          discountedPrice: { $multiply: ['$price', 0.9] },
          savings: { $subtract: ['$price', { $multiply: ['$price', 0.9] }] }
      }}
    ]).toArray();
    console.log(resC);

    // D
    console.log('\n\nD) $concat fullName:\n');
    const resD = await users.aggregate([
      { $match: { role: 'customer' } },
      { $project: {
          fullName: { $concat: ['$name.first', ' ', '$name.last'] },
          email: 1,
          _id: 0
      }}
    ]).toArray();
    console.log(resD);

  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await closeConnection();
  }
};

esercizio05();
