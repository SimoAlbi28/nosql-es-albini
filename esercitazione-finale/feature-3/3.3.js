// Es 3.3

const { MongoClient } = require("mongodb");

async function yearlyStatistics(yearFrom = new Date().getFullYear() - 30, yearTo = new Date().getFullYear()) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    const pipeline = [
      // Filtra film validi e nell'intervallo anni
      {
        $match: {
          year: { $gte: yearFrom, $lte: yearTo },
          "imdb.rating": { $exists: true, $ne: null },
          runtime: { $exists: true, $ne: null }
        }
      },

      // Unwind generi per calcolare topGenres
      { $unwind: "$genres" },

      // Group per anno e genere per count dei generi
      {
        $group: {
          _id: { year: "$year", genre: "$genres" },
          genreCount: { $sum: 1 },
          avgRating: { $avg: "$imdb.rating" },
          avgRuntime: { $avg: "$runtime" },
          movieCount: { $sum: 1 } // sarà duplicato per ogni genre, ricalcoliamo dopo
        }
      },

      // Group per anno per calcolare top 3 generi e medie
      {
        $group: {
          _id: "$_id.year",
          movieCount: { $first: "$movieCount" }, // solo uno per anno
          avgRating: { $avg: "$avgRating" },
          avgRuntime: { $avg: "$avgRuntime" },
          genres: { $push: { genre: "$_id.genre", count: "$genreCount" } }
        }
      },

      // Project finale con top 3 generi
      {
        $project: {
          _id: 0,
          year: "$_id",
          movieCount: 1,
          avgRating: { $round: ["$avgRating", 2] },
          avgRuntime: { $round: ["$avgRuntime", 0] },
          topGenres: { $slice: [ { $sortArray: { input: "$genres", sortBy: { count: -1 } } }, 3 ] }
        }
      },

      // Ordina per anno crescente
      { $sort: { year: 1 } }
    ];

    const results = await movies.aggregate(pipeline, { allowDiskUse: true }).toArray();
    return results;

  } catch (err) {
    console.error(err);
    return [];
  } finally {
    await client.close();
  }
}

// RESULT
// _id: null
// movieCount: 473
// avgRating: null
// avgRuntime: null
// genres: Array (1)


