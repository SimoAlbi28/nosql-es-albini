// ES 2.1

const { MongoClient, ObjectId } = require("mongodb");

async function getMovieWithComments(movieId, lastN = 10) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    const pipeline = [
      { $match: { _id: new ObjectId(movieId) } },
      {
        $lookup: {
          from: "comments",
          let: { movieId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$movie_id", "$$movieId"] } } },
            { $sort: { date: -1 } },
            { $limit: lastN },
            { $project: { name: 1, text: 1, date: 1, _id: 0 } }
          ],
          as: "comments"
        }
      },
      {
        $addFields: {
          totalComments: { $size: "$comments" }
        }
      }
    ];

    const results = await movies.aggregate(pipeline).toArray();
    return results[0] || null;

  } catch (err) {
    console.error(err);
    return null;
  } finally {
    await client.close();
  }
}

// RESULT
// _id: ('573a1391f29313caabcd6d40')
// plot: "A tipsy doctor encounters his patient sleepwalking on a building ledge…"
// genres: Array (2)
// runtime: 26
// rated: "PASSED"
// cast: Array (4)
// num_mflix_comments: 1
// poster: "https://m.media-amazon.com/images/M/MV5BODliMjc3ODctYjhlOC00MDM5LTgzNm…"
// title: "High and Dizzy"
// fullplot: "After a long wait, a young doctor finally has a patient come to his of…"
// languages: Array (1)
// released: 1920-07-11T00:00:00.000+00:00
// directors: Array (1)
// writers: Array (2)
// awards: Object
// lastupdated: "2015-08-11 00:35:33.717000000"
// year: 1920
// imdb: Object
// countries: Array (1)
// type: "movie"
// tomatoes: Object
// comments: Array (1)
// totalComments: 1