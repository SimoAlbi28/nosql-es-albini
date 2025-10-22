# Lesson 02 - Your Solutions

This directory contains your solutions for Lesson 02 exercises.

## Topics Covered

- Query operators ($gt, $lt, $in, $regex, etc.)
- Logical operators ($and, $or, $not, $nor)
- Projections
- Sorting and pagination
- Basic aggregation pipelines

## Exercises Checklist

### Part 1 - Query Operators (01-08)
- [ ] 01 - Comparison Operators
- [ ] 02 - Logical Operators
- [ ] 03 - Element Operators
- [ ] 04 - Array Operators
- [ ] 05 - Regex Queries
- [ ] 06 - Nested Queries
- [ ] 07 - Array Element Queries
- [ ] 08 - Complex Filters

### Part 2 - Projections & Sorting (09-13)
- [ ] 09 - Basic Projections
- [ ] 10 - Nested Projections
- [ ] 11 - Array Projections
- [ ] 12 - Sorting
- [ ] 13 - Limit & Skip (Pagination)

### Part 3 - Basic Aggregations (14-18)
- [ ] 14 - Match Stage
- [ ] 15 - Project Stage
- [ ] 16 - Group Stage
- [ ] 17 - Sort & Limit
- [ ] 18 - Multi-Stage Pipeline

## Tips for This Lesson

### Query Operators
```javascript
// Comparison
{ price: { $gt: 100, $lt: 500 } }

// Logical
{ $or: [{ status: 'active' }, { priority: 'high' }] }

// Array
{ tags: { $in: ['electronics', 'sale'] } }
```

### Projections
```javascript
// Include specific fields
db.collection.find({}, { name: 1, price: 1 })

// Exclude specific fields
db.collection.find({}, { _id: 0, password: 0 })
```

### Aggregation Pipeline
```javascript
db.collection.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: '$category', total: { $sum: 1 } } },
  { $sort: { total: -1 } }
])
```

## Testing Aggregation Pipelines

Use MongoDB Compass Aggregation Pipeline Builder:
1. Visual interface for building pipelines
2. See results at each stage
3. Export to code when done
4. Analyze performance

## Common Mistakes to Avoid

- ❌ Forgetting projection includes/excludes rule (can't mix except for _id)
- ❌ Using $match after $group (filter earlier!)
- ❌ Not testing edge cases (empty arrays, null values, etc.)
- ❌ Confusing find() operators with aggregation operators

## Need Help?

- Review query operator documentation
- Use Compass to visualize results
- Test queries with small datasets first
- Check solution only after attempting

