import { connectToDatabase, closeConnection } from '../src/connection.ts';

const esercizio01 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    
    console.log('📝 Esercizio 01: Projections Base\n');

    const result = await products
      .find(
        { status: 'active' },
        { 
          projection: {
            name: 1,
            price: 1,
            category: 1,
            _id: 0
          }
        }
      )
      .limit(10)
      .toArray();
    
    console.log(`Trovati ${result.length} prodotti:\n`);
    result.forEach((product: any, index: number) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Categoria: ${product.category}`);
      console.log(`   Prezzo: $${product.price.toFixed(2)}\n`);
    });
    
  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await closeConnection();
  }
};

esercizio01();
