import { connectToDatabase, closeConnection } from '../../utils/connection.js';

const esercizio04 = async () => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');

    console.log('📝 Esercizio 04: Sorting con Pagination\n');

    const PAGE_SIZE = 5;
    const currentPage = 2;
    const skip = (currentPage - 1) * PAGE_SIZE;

    const totalDocs = await products.countDocuments();
    const totalPages = Math.ceil(totalDocs / PAGE_SIZE);

    const pageData = await products.find({})
      .sort({ name: 1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .toArray();

    console.log(`Pagina ${currentPage}/${totalPages}`);
    console.log(pageData);

    const paginate = async (page: number, pageSize: number) => {
      const totalDocuments = await products.countDocuments();
      const totalPages = Math.ceil(totalDocuments / pageSize);
      const skip = (page - 1) * pageSize;

      const data = await products.find({})
        .sort({ name: 1 })
        .skip(skip)
        .limit(pageSize)
        .toArray();

      return {
        data,
        pagination: {
          currentPage: page,
          pageSize,
          totalDocuments,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      };
    };

    const resultPage3 = await paginate(3, PAGE_SIZE);
    console.log('\nRisultati pagina 3:\n', resultPage3);

  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await closeConnection();
  }
};

esercizio04();
