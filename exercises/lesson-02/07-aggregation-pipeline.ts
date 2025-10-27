import { connectToDatabase, closeConnection } from '../../utils/connection.js';

const esercizio07 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    const orders = db.collection('orders');

    console.log('📝 Esercizio 07: Multi-Stage Pipeline\n');

    // A
    console.log('A) Top 3 categorie:\n');
    const topCats = await products.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      { $project: { category: '$_id', count: 1, avgPrice: { $round: ['$avgPrice', 2] }, _id: 0 } }
    ]).toArray();
    console.log(topCats);

    // B
    console.log('\n\nB) Top 5 clienti per spesa:\n');
    const topClients = await orders.aggregate([
      { $match: { status: 'delivered' } },
      { $group: {
        _id: '$userId',
        totalSpent: { $sum: '$total' },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: '$total' }
      }},
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]).toArray();
    console.log(topClients);

    // C
    console.log('\n\nC) Distribuzione per range di prezzo:\n');
    const priceDist = await products.aggregate([
      { $match: { status: 'active' } },
      { $project: {
        price: 1,
        priceRange: {
          $switch: {
            branches: [
              { case: { $lt: ['$price', 50] }, then: 'Budget' },
              { case: { $lt: ['$price', 200] }, then: 'Mid-range' },
              { case: { $lt: ['$price', 1000] }, then: 'Premium' }
            ],
            default: 'Luxury'
          }
        }
      }},
      { $group: {
        _id: '$priceRange',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }}
    ]).toArray();
    console.log(priceDist);

    // D
    console.log('\n\nD) Revenue mensile 2024:\n');
    const monthly = await orders.aggregate([
      { $match: { status: 'delivered', date: { $gte: new Date('2024-01-01'), $lt: new Date('2025-01-01') } } },
      { $group: {
        _id: { $month: '$date' },
        revenue: { $sum: '$total' },
        orderCount: { $sum: 1 }
      }},
      { $sort: { '_id': 1 } },
      { $project: {
        month: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 1] }, then: 'January' },
              { case: { $eq: ['$_id', 2] }, then: 'February' },
              { case: { $eq: ['$_id', 3] }, then: 'March' },
              { case: { $eq: ['$_id', 4] }, then: 'April' },
              { case: { $eq: ['$_id', 5] }, then: 'May' },
              { case: { $eq: ['$_id', 6] }, then: 'June' },
              { case: { $eq: ['$_id', 7] }, then: 'July' },
              { case: { $eq: ['$_id', 8] }, then: 'August' },
              { case: { $eq: ['$_id', 9] }, then: 'September' },
              { case: { $eq: ['$_id', 10] }, then: 'October' },
              { case: { $eq: ['$_id', 11] }, then: 'November' },
              { case: { $eq: ['$_id', 12] }, then: 'December' }
            ],
            default: 'Unknown'
          }
        },
        revenue: 1,
        orderCount: 1,
        _id: 0
      }}
    ]).toArray();
    console.log(monthly);

  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await closeConnection();
  }
};

esercizio07();
