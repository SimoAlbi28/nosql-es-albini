# Lesson 03 - Your Solutions

This directory contains your solutions for Lesson 03 exercises.

## Topics Covered

- Advanced aggregation operators
- $lookup (joins)
- $unwind (array deconstruction)
- $facet, $bucket
- Performance optimization
- Indexing strategies

## Exercises Checklist

### Part 1 - Advanced Aggregations (01-10)
- [ ] 01 - Lookup Basic
- [ ] 02 - Unwind Arrays
- [ ] 03 - Lookup & Unwind Combined
- [ ] 04 - Group Advanced
- [ ] 05 - Facet Pipeline
- [ ] 06 - Bucket Ranges
- [ ] 07 - Computed Fields
- [ ] 08 - Conditional Logic
- [ ] 09 - Date Operations
- [ ] 10 - Complex Analytics

### Part 2 - Performance & Indexes (11-15)
- [ ] 11 - Explain Analysis
- [ ] 12 - Index Creation
- [ ] 13 - Compound Indexes
- [ ] 14 - Pipeline Optimization
- [ ] 15 - Optimization Challenge

## Advanced Aggregation Patterns

### $lookup (Join Collections)
```javascript
{
  $lookup: {
    from: 'products',
    localField: 'productId',
    foreignField: '_id',
    as: 'productDetails'
  }
}
```

### $unwind (Flatten Arrays)
```javascript
{ $unwind: '$items' }
// or preserve empty arrays:
{ $unwind: { path: '$items', preserveNullAndEmptyArrays: true } }
```

### $facet (Multiple Pipelines)
```javascript
{
  $facet: {
    stats: [{ $group: { _id: null, total: { $sum: 1 } } }],
    topItems: [{ $sort: { count: -1 } }, { $limit: 10 }]
  }
}
```

## Performance Optimization

### Using explain()
```javascript
db.collection.find({ status: 'active' }).explain('executionStats')
```

Key metrics to watch:
- `executionTimeMillis` - Lower is better
- `totalDocsExamined` - Should be close to nReturned
- `indexName` - Ensure index is being used
- `stage` - Look for COLLSCAN (bad) vs IXSCAN (good)

### Creating Indexes
```javascript
// Single field index
db.collection.createIndex({ email: 1 })

// Compound index (order matters!)
db.collection.createIndex({ status: 1, createdAt: -1 })

// Index with options
db.collection.createIndex(
  { name: 'text' },
  { name: 'name_text_index' }
)
```

### Index Strategy Rules

1. **ESR Rule**: Equality, Sort, Range
   - Equality fields first
   - Sort fields second
   - Range fields last

2. **Selectivity**: Index fields with high selectivity first

3. **Coverage**: Include projection fields in index when possible

## Pipeline Optimization Tips

### 1. Filter Early
```javascript
// ✅ Good: $match first
[
  { $match: { status: 'active' } },
  { $lookup: ... },
  { $unwind: ... }
]

// ❌ Bad: $match late
[
  { $lookup: ... },
  { $unwind: ... },
  { $match: { status: 'active' } }
]
```

### 2. Project Before Group
```javascript
// ✅ Good: reduce document size early
[
  { $project: { category: 1, price: 1 } },
  { $group: { _id: '$category', total: { $sum: '$price' } } }
]
```

### 3. Limit After Sort
```javascript
// ✅ Good: only sorts top N
[
  { $sort: { date: -1 } },
  { $limit: 10 }
]
```

### 4. Use Indexes
```javascript
// Create index on match fields
db.orders.createIndex({ status: 1, orderDate: -1 })

// Then pipeline can use it
[
  { $match: { status: 'completed' } },
  { $sort: { orderDate: -1 } }
]
```

## Testing Performance

1. **Create index first**
2. **Run explain() on query**
3. **Note executionTimeMillis**
4. **Try different index combinations**
5. **Compare results**

## Common Performance Issues

- ❌ No indexes on $match fields
- ❌ $lookup on unindexed fields
- ❌ Sorting large result sets without index
- ❌ $unwind before $match
- ❌ Not using covered queries when possible

## Preparation for Competition

These exercises prepare you for the final competition:
- Practice building complex pipelines
- Learn to analyze performance
- Understand index strategies
- Master explain() output

## Need Help?

- Use Compass to visualize pipeline stages
- Run explain() frequently
- Test with large datasets (seed-lesson-03)
- Compare naive vs optimized approaches

