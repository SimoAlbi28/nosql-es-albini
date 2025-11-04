// ES 3.1 

const { MongoClient } = require("mongodb");

async function genreStatistics(limit = 15) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    const pipeline = [
      // Solo film con rating disponibile
      { $match: { "imdb.rating": { $exists: true, $ne: null } } },

      // Unwind dei generi
      { $unwind: { path: "$genres", preserveNullAndEmptyArrays: false } },

      // Sort per rating decrescente per $first topMovie
      { $sort: { "imdb.rating": -1 } },

      // Group per genere
      {
        $group: {
          _id: "$genres",
          movieCount: { $sum: 1 },
          avgRating: { $avg: "$imdb.rating" },
          avgRuntime: { $avg: "$runtime" },
          totalAwards: { $sum: "$awards.wins" },
          topMovieTitle: { $first: "$title" },
          topMovieRating: { $first: "$imdb.rating" },
          topMovieYear: { $first: "$year" },
          topMoviePoster: { $first: "$poster" }
        }
      },

      // Project finale
      {
        $project: {
          _id: 0,
          genre: "$_id",
          movieCount: 1,
          avgRating: { $round: ["$avgRating", 2] },
          avgRuntime: { $round: ["$avgRuntime", 0] },
          totalAwards: 1,
          topMovie: {
            title: "$topMovieTitle",
            rating: "$topMovieRating",
            year: "$topMovieYear",
            poster: "$topMoviePoster"
          }
        }
      },

      // Sort finale per movieCount
      { $sort: { movieCount: -1 } },

      // Limit top generi
      { $limit: limit }
    ];

    // Importante: allowDiskUse true per evitare errori memoria
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
// movieCount: 12385
// totalAwards: 62720
// genre: "Drama"
// avgRating: 6.8
// avgRuntime: 109
// topMovie: Object
