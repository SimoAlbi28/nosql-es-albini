// ES 5.2

// STEP 1
db.movies.createIndex(
  { year: 1, genres: 1, title: 1 },
  { name: "covered_query_index" }
)

// STEP 2
db.movies.find(
  { year: { $gte: 2015 }, genres: "Action" },
  { _id: 0, title: 1, year: 1, genres: 1 }
)

// STEP 3
db.movies.find(
  { year: { $gte: 2015 }, genres: "Action" },
  { _id: 0, title: 1, year: 1, genres: 1 }
).explain("executionStats")