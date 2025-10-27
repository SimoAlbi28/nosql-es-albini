import { connectToDatabase, closeConnection } from '../../utils/connection.js';

const challenge = async () => {
  try {
    const db = await connectToDatabase();

    console.log('🏆 Challenge: Product Analytics Dashboard\n');
    console.log('Top 5 Products by Revenue (min 3 orders)\n');
    console.log('='.repeat(70));

    const topProducts = await db.collection('orders').aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      { $group: {
        _id: '$items.productId',
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        totalQuantitySold: { $sum: '$items.quantity' },
        orderCount: { $sum: 1 },
        avgRevenuePerOrder: { $avg: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $match: { orderCount: { $gte: 3 } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }},
      { $unwind: '$product' },
      { $project: {
        _id: 0,
        productName: '$product.name',
        totalRevenue: 1,
        orderCount: 1,
        avgRevenuePerOrder: 1,
        totalQuantitySold: 1
      }}
    ]).toArray();

    topProducts.forEach((product: any, index: number) => {
      console.log(`\n${index + 1}. ${product.productName}`);
      console.log(`   Totale Revenue: $${product.totalRevenue.toFixed(2)}`);
      console.log(`   Quantità vendute: ${product.totalQuantitySold}`);
      console.log(`   Ordini: ${product.orderCount}`);
      console.log(`   Media per ordine: $${product.avgRevenuePerOrder.toFixed(2)}`);
    });

  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await closeConnection();
  }
};

challenge();
