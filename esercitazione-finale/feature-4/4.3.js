// ES 4.3

db.movies.aggregate([
  // ⿡ Filtra film con rating alto
  {
    $match: {
      "imdb.rating": { $gte: 7.5 },
      // genres: "Drama" // puoi sbloccarlo per filtrare per genere
    }
  },

  // ⿢ Recupera i commenti associati
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "movie_id",
      as: "comments"
    }
  },

  // ⿣ Conta i commenti
  {
    $addFields: {
      commentCount: { $size: { $ifNull: ["$comments", []] } }
    }
  },

  // ⿤ Filtra film con pochi commenti (da 1 a 19)
  {
    $match: {
      commentCount: { $gt: 0, $lt: 20 }
    }
  },

  // ⿥ Calcola lo “hidden score”
  //   (rating / sqrt(commentCount))
  {
    $addFields: {
      hiddenScore: {
        $multiply: [
          { $ifNull: ["$imdb.rating", 0] },
          { $divide: [1, { $sqrt: "$commentCount" }] }
        ]
      }
    }
  },

  // ⿦ Ordina per hidden score decrescente
  { $sort: { hiddenScore: -1 } },

  // ⿧ Limita ai top 20 risultati
  { $limit: 20 },

  // ⿨ Proietta i campi da mostrare
  {
    $project: {
      _id: 0,
      title: 1,
      year: 1,
      genres: 1,
      poster: 1,
      rating: "$imdb.rating",
      commentCount: 1,
      hiddenScore: { $round: ["$hiddenScore", 2] }
    }
  }
]).pretty();