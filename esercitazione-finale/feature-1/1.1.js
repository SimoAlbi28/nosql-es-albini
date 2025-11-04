// ES 1.1

const { MongoClient } = require("mongodb");

async function main() {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    const pipeline = [
      {
        $match: { title: { $regex: "god", $options: "i" } }
      },
      {
        $project: {
          title: 1,
          year: 1,
          poster: 1,
          "imdb.rating": 1,
          _id: 0
        }
      },
      {
        $sort: { "imdb.rating": -1 }
      },
      {
        $limit: 20
      }
    ];

    const results = await movies.aggregate(pipeline).toArray();
    console.log(results);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();

// RESULT
// imdb: Object
// year: 1972
// title: "The Godfather"
// poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYx