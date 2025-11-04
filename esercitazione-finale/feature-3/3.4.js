// ES 3.4

const { MongoClient } = require("mongodb");

async function countryStatistics(topN = 20) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    const pipeline = [
      // Solo film con rating disponibile
      { $match: { "imdb.rating": { $exists: true, $ne: null } } },

      // Unwind dei paesi
      { $unwind: { path: "$countries", preserveNullAndEmptyArrays: false } },

      // Unwind dei registi per topDirectors
      { $unwind: { path: "$directors", preserveNullAndEmptyArrays: false } },

      // Facet per overall e byDecade
      {
        $facet: {
          overall: [
            // Group per country + director + genre
            {
              $group: {
                _id: { country: "$countries", director: "$directors" },
                movieCountDirector: { $sum: 1 },
                genres: { $addToSet: "$genres" },
                ratingSum: { $sum: "$imdb.rating" },
                ratingCount: { $sum: 1 }
              }
            },
            // Group per country
            {
              $group: {
                _id: "$_id.country",
                movieCount: { $sum: "$ratingCount" },
                avgRating: { $avg: { $divide: ["$ratingSum", "$ratingCount"] } },
                directors: { $push: { name: "$_id.director", count: "$movieCountDirector" } },
                genres: { $push: "$genres" }
              }
            },
            // Process top 3 directors e top 3 genres
            {
              $project: {
                country: "$_id",
                movieCount: 1,
                avgRating: { $round: ["$avgRating", 2] },
                topDirectors: { $slice: [ { $sortArray: { input: "$directors", sortBy: { count: -1 } } }, 3 ] },
                topGenres: { 
                  $slice: [
                    { $sortArray: { input: { $reduce: { input: "$genres", initialValue: [], in: { $concatArrays: ["$$value","$$this"] } } }, sortBy: { count: -1 } } }, 
                    3 
                  ]
                }
              }
            },
            { $sort: { movieCount: -1 } },
            { $limit: topN }
          ],

          byDecade: [
            // Aggiunge campo decade
            {
              $addFields: {
                decade: { $concat: [ { $toString: { $multiply: [ { $floor: { $divide: ["$year", 10] } }, 10 ] } }, "s" ] }
              }
            },
            // Group per decade + country
            {
              $group: {
                _id: { decade: "$decade", country: "$countries" },
                movieCount: { $sum: 1 },
                avgRating: { $avg: "$imdb.rating" }
              }
            },
            { $sort: { "_id.decade": 1, movieCount: -1 } }
          ]
        }
      }
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
// overall: Array (20)
// byDecade: Array (559)