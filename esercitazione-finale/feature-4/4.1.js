// Es 4.1

const { MongoClient, ObjectId } = require("mongodb");

async function getSimilarMovies(movieId, topN = 10) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    // Recupera il film di riferimento
    const referenceMovie = await movies.findOne({ _id: new ObjectId(movieId) });
    if (!referenceMovie) return [];

    const pipeline = [
      // Escludi il film originale
      { $match: { _id: { $ne: referenceMovie._id }, "imdb.rating": { $gte: 6 } } },

      // Project per calcolare match
      {
        $project: {
          title: 1,
          year: 1,
          poster: 1,
          "imdb.rating": 1,
          commonGenres: {
            $size: { $setIntersection: ["$genres", referenceMovie.genres] }
          },
          sameDirector: {
            $cond: [
              { $gt: [{ $size: { $setIntersection: ["$directors", referenceMovie.directors] } }, 0] },
              1,
              0
            ]
          },
          commonCast: {
            $size: { $setIntersection: ["$cast", referenceMovie.cast] }
          }
        }
      },

      // Calcola similarity score e matchReasons
      {
        $addFields: {
          similarityScore: {
            $add: [
              { $multiply: ["$commonGenres", 3] },
              { $multiply: ["$sameDirector", 5] },
              { $multiply: ["$commonCast", 2] }
            ]
          },
          matchReasons: {
            $concatArrays: [
              { $cond: [{ $gt: ["$commonGenres", 0] }, [{ $concat: [{ $toString: "$commonGenres" }, " genres match"] }], []] },
              { $cond: [{ $eq: ["$sameDirector", 1] }, ["Same director"], []] },
              { $cond: [{ $gt: ["$commonCast", 0] }, [{ $concat: [{ $toString: "$commonCast" }, " cast members match"] }], []] }
            ]
          }
        }
      },

      // Ordina per similarity score decrescente
      { $sort: { similarityScore: -1 } },

      // Limita ai top N film
      { $limit: topN }
    ];

    const results = await movies.aggregate(pipeline).toArray();
    return results;

  } catch (err) {
    console.error(err);
    return [];
  } finally {
    await client.close();
  }
}

// RESULT
// _id: 573a1396f29313caabce4a9a
// imdb: Object
// year: 1972
// title: "The Godfather"
// poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNW…"
// commonGenres: 2
// sameDirector: 1
// commonCast: 3
// similarityScore: 17
// matchReasons: Array (3)
