// ES 2.2

const { MongoClient } = require("mongodb");

async function searchMovies(filters = {}, options = {}) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    const { genre, yearFrom, yearTo, minRating, country, language } = filters;
    const { page = 1, limit = 20, sortBy = "imdb.rating", sortOrder = "desc" } = options;

    const match = {};

    if (genre) match.genres = genre;
    if (yearFrom || yearTo) match.year = {};
    if (yearFrom) match.year.$gte = yearFrom;
    if (yearTo) match.year.$lte = yearTo;
    if (minRating) match["imdb.rating"] = { $gte: minRating };
    if (country) match.countries = country;
    if (language) match.languages = language;

    const pipeline = [
      { $match: match },
      {
        $project: {
          title: 1,
          year: 1,
          genres: 1,
          poster: 1,
          "imdb.rating": 1,
          countries: 1,
          _id: 0
        }
      },
      { $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
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
// year:1972
// genres: Array (2)
// title: "The Godfather"
// poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNW…"
// countries: Array (1)