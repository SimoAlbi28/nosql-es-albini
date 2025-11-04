// ES 2.2

const { MongoClient } = require("mongodb");

async function topCommentedMovies(limit = 20) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const comments = db.collection("comments");

    const pipeline = [
      // Raggruppa per movie_id
      {
        $group: {
          _id: "$movie_id",
          commentCount: { $sum: 1 },
          lastCommentDate: { $max: "$date" }
        }
      },
      // Solo film con almeno 1 commento
      { $match: { commentCount: { $gte: 1 } } },
      // Ordina per numero commenti decrescente
      { $sort: { commentCount: -1 } },
      // Limita ai top N
      { $limit: limit },
      // Unisci con movies
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie"
        }
      },
      { $unwind: "$movie" },
      // Project finale
      {
        $project: {
          title: "$movie.title",
          year: "$movie.year",
          poster: "$movie.poster",
          genres: "$movie.genres",
          "imdb.rating": "$movie.imdb.rating",
          commentCount: 1,
          lastCommentDate: 1,
          _id: 0
        }
      }
    ];

    const results = await comments.aggregate(pipeline).toArray();
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
// commentCount: 21349
// lastCommentDate: null