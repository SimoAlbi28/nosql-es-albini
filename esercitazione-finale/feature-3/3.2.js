// Es 3.2

const { MongoClient } = require("mongodb");

async function directorStatistics(minMovies = 3, topN = 20) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    const pipeline = [
      // Solo film con rating disponibile
      { $match: { "imdb.rating": { $exists: true, $ne: null } } },

      // Unwind array directors
      { $unwind: { path: "$directors", preserveNullAndEmptyArrays: false } },

      // Sort per rating decrescente per prendere bestMovie
      { $sort: { "imdb.rating": -1 } },

      // Group per regista
      {
        $group: {
          _id: "$directors",
          movieCount: { $sum: 1 },
          avgRating: { $avg: "$imdb.rating" },
          totalAwards: { $sum: "$awards.wins" },
          bestMovieTitle: { $first: "$title" },
          bestMovieRating: { $first: "$imdb.rating" },
          genres: { $addToSet: "$genres" } // array di array
        }
      },

      // Flatten array di array dei generi
      {
        $project: {
          director: "$_id",
          movieCount: 1,
          avgRating: { $round: ["$avgRating", 2] },
          totalAwards: 1,
          bestMovie: {
            title: "$bestMovieTitle",
            rating: "$bestMovieRating"
          },
          genres: { $reduce: {
            input: "$genres",
            initialValue: [],
            in: { $setUnion: ["$$value", "$$this"] }
          }}
        }
      },

      // Filtra registi con almeno minMovies
      { $match: { movieCount: { $gte: minMovies } } },

      // Sort finale: prima avgRating, poi movieCount
      { $sort: { avgRating: -1, movieCount: -1 } },

      // Limita ai topN registi
      { $limit: topN }
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
// _id: "Rocco Urbisci"
// movieCount: 5
// totalAwards: 6
// director: "Rocco Urbisci"
// avgRating: 8.46
// bestMovie: Object
// genres: Array (2)