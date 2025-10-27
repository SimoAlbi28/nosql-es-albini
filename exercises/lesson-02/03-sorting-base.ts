import { connectToDatabase, closeConnection } from '../src/connection.ts';

const esercizio03 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    
    console.log('📝 Esercizio 03: Sorting Base\n');

    // A
    console.log('A) Prodotti dal più economico al più costoso:\n');
    const cheapToExpensive = await products.find({ status: 'active' }).sort({ price: 1 }).limit(5).toArray();
    console.log(cheapToExpensive);

    // B
    console.log('\n\nB) Top 5 prodotti più costosi:\n');
    const expensive = await products.find({ status: 'active' }).sort({ price: -1 }).limit(5).toArray();
    console.log(expensive);

    // C
    console.log('\n\nC) Prodotti per categoria (A-Z), poi per prezzo (alto-basso):\n');
    const sortedMulti = await products.find({ status: 'active' }).sort({ category: 1, price: -1 }).limit(10).toArray();
    console.log(sortedMulti);

    // D
    console.log('\n\nD) Top 5 prodotti per rating:\n');
    const topRated = await products.find({ 'rating.count': { $gte: 10 } }).sort({ 'rating.average': -1 }).limit(5).toArray();
    console.log(topRated);
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await closeConnection();
  }
};

esercizio03();
