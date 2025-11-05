// ES 4.2

const { MongoClient, ObjectId } = require("mongodb");

async function getMovieRecommendations(email) {
  const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/sample_mflix";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_mflix");
    const comments = db.collection("comments");
    const movies = db.collection("movies");

    // --- STEP 1: trova generi preferiti (top 3)
    const topGenres = await comments
      .aggregate([
        { $match: { email } },
        {
          $lookup: {
            from: "movies",
            localField: "movie_id",
            foreignField: "_id",
            as: "movie",
          },
        },
        { $unwind: "$movie" },
        { $unwind: "$movie.genres" },
        {
          $group: {
            _id: "$movie.genres",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 3 },
      ])
      .toArray();

    const preferredGenres = topGenres.map((g) => g._id);

    // --- STEP 2: trova registi preferiti (top 2)
    const topDirectors = await comments
      .aggregate([
        { $match: { email } },
        {
          $lookup: {
            from: "movies",
            localField: "movie_id",
            foreignField: "_id",
            as: "movie",
          },
        },
        { $unwind: "$movie" },
        { $unwind: "$movie.directors" },
        {
          $group: {
            _id: "$movie.directors",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 2 },
      ])
      .toArray();

    const preferredDirectors = topDirectors.map((d) => d._id);

    // --- STEP 3: escludi film già commentati
    const commentedIds = await comments.distinct("movie_id", { email });

    // --- STEP 4: trova raccomandazioni
    const recommendations = await movies
      .aggregate([
        {
          $match: {
            _id: { $nin: commentedIds },
            "imdb.rating": { $gte: 7.5 },
            $or: [
              { genres: { $in: preferredGenres } },
              { directors: { $in: preferredDirectors } },
            ],
          },
        },
        {
          $addFields: {
            hasPreferredGenre: { $gt: [{ $size: { $setIntersection: ["$genres", preferredGenres] } }, 0] },
            hasPreferredDirector: { $gt: [{ $size: { $setIntersection: ["$directors", preferredDirectors] } }, 0] },
          },
        },
        {
          $addFields: {
            priority: {
              $switch: {
                branches: [
                  { case: { $and: ["$hasPreferredGenre", "$hasPreferredDirector"] }, then: 1 },
                  { case: "$hasPreferredDirector", then: 2 },
                  { case: "$hasPreferredGenre", then: 3 },
                ],
                default: 4,
              },
            },
          },
        },
        { $sort: { priority: 1, "imdb.rating": -1 } },
        { $limit: 15 },
        { $project: { title: 1, genres: 1, directors: 1, "imdb.rating": 1, priority: 1 } },
      ])
      .toArray();

    console.log("Generi preferiti:", preferredGenres);
    console.log("Registi preferiti:", preferredDirectors);
    console.log("Raccomandazioni:", recommendations);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

getMovieRecommendations("user@example.com");

// RESULT

