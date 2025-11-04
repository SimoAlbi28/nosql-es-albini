// ES 1.3

const { MongoClient } = require("mongodb");

async function searchByDirectorOrActor(filters = {}) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    const { director, actor, minAwards } = filters;

    const match = {};

    if (director) {
      match.directors = { $elemMatch: { $regex: director, $options: "i" } };
    }

    if (actor) {
      match.cast = { $elemMatch: { $regex: actor, $options: "i" } };
    }

    if (minAwards) {
      match["awards.wins"] = { $gte: minAwards };
    }

    const pipeline = [
      { $match: match },
      {
        $project: {
          title: 1,
          year: 1,
          directors: 1,
          cast: { $slice: ["$cast", 3] },
          "awards.wins": 1,
          "awards.nominations": 1,
          "imdb.rating": 1,
          poster: 1,
          _id: 0
        }
      },
      { $sort: { "awards.wins": -1, "imdb.rating": -1 } },
      { $limit: 30 }
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
// imdb: Object
// year: 1972
// title: "The Godfather"
// poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNW…"
// awards: Object
// directors: Array (1)
// cast: Array (3)