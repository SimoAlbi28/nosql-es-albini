// ES 2.3

const { MongoClient } = require("mongodb");

async function userCommentStats(email) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const comments = db.collection("comments");

    const pipeline = [
      { $match: { email } },
      {
        $lookup: {
          from: "movies",
          localField: "movie_id",
          foreignField: "_id",
          as: "movie"
        }
      },
      { $unwind: "$movie" },
      {
        $facet: {
          // Statistiche aggregate
          statistics: [
            // Generi top 3
            { $unwind: "$movie.genres" },
            {
              $group: {
                _id: "$movie.genres",
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 3 },
            {
              $group: {
                _id: null,
                topGenres: { $push: { genre: "$_id", count: "$count" } }
              }
            }
          ],
          // Cronologia commenti
          timeline: [
            { $sort: { date: -1 } },
            { $limit: 50 },
            {
              $project: {
                commentText: "$text",
                commentDate: "$date",
                movieTitle: "$movie.title",
                movieYear: "$movie.year",
                movieRating: "$movie.imdb.rating",
                _id: 0
              }
            }
          ],
          // Statistiche aggiuntive
          totals: [
            {
              $group: {
                _id: null,
                totalComments: { $sum: 1 },
                avgRating: { $avg: "$movie.imdb.rating" }
              }
            }
          ],
          // Registi top 3
          topDirectors: [
            { $unwind: "$movie.directors" },
            {
              $group: {
                _id: "$movie.directors",
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } },
            { $limit: 3 },
            {
              $group: {
                _id: null,
                topDirectors: { $push: { director: "$_id", count: "$count" } }
              }
            }
          ]
        }
      }
    ];

    const results = await comments.aggregate(pipeline).toArray();
    return results[0]; // Facet restituisce array con 1 elemento

  } catch (err) {
    console.error(err);
    return null;
  } finally {
    await client.close();
  }
}

// RESULT
// statistics: Array (empty)
// timeline: Array (empty)
// totals: Array (empty)
// topDirectors: Array (empty)