// ES 5.1

//QUERY1
db.movies.aggregate([
  { 
    $match: { 
      year: { $gte: 2015 },
      genres: "Action"
    } 
  },
  { $sort: { "imdb.rating": -1 } },
  { $limit: 20 },
  { $project: { title: 1, year: 1, genres: 1, "imdb.rating": 1, runtime: 1, cast: 1, directors: 1, plot: 1, poster: 1 } }
])

//QUERY2
db.comments.aggregate([
  { 
    $lookup: {
      from: "users",
      let: { email: "$email" },
      pipeline: [
        { $match: { $expr: { $eq: ["$email", "$$email"] } } },
        { $project: { name: 1, _id: 0 } }
      ],
      as: "user"
    } 
  },
  { $unwind: "$user" },
  {
    $lookup: {
      from: "movies",
      let: { movieId: "$movie_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$movieId"] } } },
        { $project: { "imdb.rating": 1 } }
      ],
      as: "movie"
    }
  },
  { $unwind: "$movie" },
  {
    $group: {
      _id: "$email",
      userName: { $first: "$user.name" },
      commentCount: { $sum: 1 },
      avgMovieRating: { $avg: "$movie.imdb.rating" }
    }
  },
  { $match: { commentCount: { $gte: 5 } } },
  { $sort: { commentCount: -1 } },
  { $limit: 50 }
])

//QUERY3
db.movies.aggregate([
  { 
    $match: { year: { $exists: true } } 
  },
  { 
    $addFields: { decade: { $subtract: ["$year", { $mod: ["$year", 10] }] } } 
  },
  { $unwind: "$genres" },
  { 
    $group: { 
      _id: { decade: "$decade", genre: "$genres" }, 
      movieCount: { $sum: 1 } 
    } 
  },
  { $sort: { "_id.decade": 1 } }
])