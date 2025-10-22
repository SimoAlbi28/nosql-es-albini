# Exercise 02 - Find Documents

**Difficulty**: ⭐ Beginner  
**Topics**: find, findOne, basic filters, comparison operators  
**Estimated Time**: 25 minutes

---

## Learning Objectives

By completing this exercise, you will:
- ✅ Use `find()` to query multiple documents
- ✅ Use `findOne()` to retrieve a single document
- ✅ Apply basic filters to narrow results
- ✅ Use comparison operators ($gt, $lt, $gte, $lte, $eq, $ne)
- ✅ Count documents with `countDocuments()`

---

## Prerequisites

- Completed Exercise 01 (documents inserted in database)
- MongoDB Compass connected
- `ecommerce` database with `users` and `products` collections

---

## Part 1: Basic Find Operations

### Task 1.1: Find All Documents

Query all users in the collection.

**Collection**: `users`

**Query**:
```javascript
db.users.find()
```

**Questions**:
- How many users are returned?
- What fields does each user have?

<details>
<summary>💡 Expected Behavior</summary>

`find()` with no filter returns ALL documents in the collection.
In Compass, you'll see all user documents listed.
</details>

---

### Task 1.2: Find All with Pretty Print

In mongosh (MongoDB Shell), you can format output:

```javascript
db.users.find().pretty()
```

**Note**: In Compass, documents are already formatted nicely!

---

### Task 1.3: Find One Document

Retrieve a single user (any user):

```javascript
db.users.findOne()
```

**Question**: How is this different from `find()`?

<details>
<summary>💡 Answer</summary>

- `find()` returns a cursor (iterable) containing all matching documents
- `findOne()` returns a single document (or null if no match)
- `findOne()` is more efficient when you only need one result
</details>

---

## Part 2: Find with Filters

### Task 2.1: Find by Email

Find the user with email "emma.wilson@example.com".

**Collection**: `users`

**Expected Fields in Result**:
- name.first: "Emma"
- name.last: "Wilson"
- email: "emma.wilson@example.com"

<details>
<summary>💡 Solution</summary>

```javascript
db.users.findOne({ email: "emma.wilson@example.com" })
```
</details>

---

### Task 2.2: Find by Role

Find ALL users with role "customer".

**Collection**: `users`

**Expected**: Multiple users (should be at least 4-5 customers from Exercise 01)

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({ role: "customer" })
```
</details>

---

### Task 2.3: Find by Status

Find all users where status is "active".

**Collection**: `users`

**Count the results**: How many active users exist?

<details>
<summary>💡 Hint</summary>

```javascript
// Find active users
db.users.find({ status: "active" })

// Count them
db.users.countDocuments({ status: "active" })
```
</details>

---

### Task 2.4: Find by Multiple Criteria

Find users who are BOTH:
- Role: "customer"
- Status: "active"

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({
  role: "customer",
  status: "active"
})
```

Multiple fields in the query act as AND conditions.
</details>

---

## Part 3: Comparison Operators

### Task 3.1: Find Products Above Price

Find all products with price greater than $100.

**Collection**: `products`

**Expected**: Should include laptops, headphones (depending on your data)

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  price: { $gt: 100 }
})
```

`$gt` means "greater than"
</details>

---

### Task 3.2: Find Products in Price Range

Find products with price between $50 and $150 (inclusive).

**Collection**: `products`

**Operators to use**: `$gte` (greater than or equal), `$lte` (less than or equal)

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  price: {
    $gte: 50,
    $lte: 150
  }
})
```
</details>

---

### Task 3.3: Find Cheap Products

Find products with price less than or equal to $50.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  price: { $lte: 50 }
})
```
</details>

---

### Task 3.4: Find Non-Featured Products

Find products where `featured` is NOT true.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  featured: { $ne: true }
})

// Or explicitly false
db.products.find({
  featured: false
})

// Or doesn't exist
db.products.find({
  featured: { $exists: false }
})
```

`$ne` means "not equal"
</details>

---

## Part 4: Querying Nested Fields

### Task 4.1: Query Nested Object

Find user "Emma Wilson" by querying her first name.

**Collection**: `users`

**Hint**: Use dot notation for nested fields

<details>
<summary>💡 Solution</summary>

```javascript
db.users.findOne({
  "name.first": "Emma"
})
```

Use quotes around the field path with dots.
</details>

---

### Task 4.2: Query by City

Find users who live in "New York" (if you have address data).

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({
  "address.city": "New York"
})
```
</details>

---

### Task 4.3: Query Specifications

Find products with bluetooth connectivity.

**Collection**: `products`

**Hint**: specifications.connectivity contains "Bluetooth"

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  "specifications.connectivity": /Bluetooth/i
})

// Or exact match
db.products.find({
  "specifications.connectivity": "Bluetooth 5.2"
})
```
</details>

---

## Part 5: Querying Arrays

### Task 5.1: Find by Single Tag

Find products tagged with "wireless".

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  tags: "wireless"
})
```

MongoDB automatically searches within arrays!
</details>

---

### Task 5.2: Find by Multiple Tags

Find products that have BOTH "wireless" AND "premium" tags.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  tags: { $all: ["wireless", "premium"] }
})
```

`$all` ensures ALL specified values are in the array.
</details>

---

### Task 5.3: Find by Any Tag

Find products that have EITHER "laptop" OR "mouse" tags.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  tags: { $in: ["laptop", "mouse"] }
})
```

`$in` matches if ANY of the specified values are in the array.
</details>

---

## Part 6: Counting Documents

### Task 6.1: Count All Users

Count the total number of users.

<details>
<summary>💡 Solution</summary>

```javascript
db.users.countDocuments()
```
</details>

---

### Task 6.2: Count Active Customers

Count users where:
- role: "customer"
- status: "active"

<details>
<summary>💡 Solution</summary>

```javascript
db.users.countDocuments({
  role: "customer",
  status: "active"
})
```
</details>

---

### Task 6.3: Count Expensive Products

Count products with price > $500.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.countDocuments({
  price: { $gt: 500 }
})
```
</details>

---

## Part 7: Limiting and Sorting Results

### Task 7.1: Limit Results

Find only the first 3 users.

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find().limit(3)
```
</details>

---

### Task 7.2: Sort Products by Price

Find all products sorted by price (ascending - low to high).

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find().sort({ price: 1 })
```

`1` = ascending, `-1` = descending
</details>

---

### Task 7.3: Find Most Expensive Products

Find the top 5 most expensive products.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find().sort({ price: -1 }).limit(5)
```
</details>

---

## Validation & Testing

### Verify Your Queries

Test each query in MongoDB Compass:

1. **Filter bar**: Enter your query JSON
2. **Click "Find"**
3. **Verify results** match expectations

### Common Query Patterns to Test

```javascript
// Find by exact match
db.users.find({ role: "admin" })

// Find by comparison
db.products.find({ price: { $gt: 100 } })

// Find by nested field
db.users.find({ "name.first": "Emma" })

// Find by array element
db.products.find({ tags: "wireless" })

// Count results
db.users.countDocuments({ status: "active" })
```

---

## Common Mistakes to Avoid

❌ **Forgetting quotes** around nested fields: Use `"address.city"` not `address.city`
❌ **Using wrong operator**: `$gt` for "greater than", not `>`
❌ **Confusing $in vs $all**: `$in` = any match, `$all` = all must match
❌ **Not using curly braces** for operators: `{ price: { $gt: 100 } }`
❌ **Mixing up 1 and -1** in sort: `1` = ascending, `-1` = descending

---

## Success Criteria

- [ ] Can retrieve all documents with find()
- [ ] Can retrieve single document with findOne()
- [ ] Can filter by exact field values
- [ ] Can use comparison operators ($gt, $gte, $lt, $lte, $ne)
- [ ] Can query nested fields with dot notation
- [ ] Can query arrays ($in, $all)
- [ ] Can count documents with countDocuments()
- [ ] Can sort and limit results

---

## Additional Challenges (Optional)

### Challenge 1: Complex Filter

Find active customers who:
- Have "gmail.com" email addresses
- Live in "New York"

**Hint**: You'll need to use $regex for email pattern matching.

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({
  role: "customer",
  status: "active",
  email: { $regex: /gmail\.com$/ },
  "address.city": "New York"
})
```
</details>

### Challenge 2: Price Analysis

Find the average, minimum, and maximum product prices.

**Hint**: You'll need aggregation framework (preview of later lessons!).

<details>
<summary>💡 Solution</summary>

```javascript
db.products.aggregate([
  {
    $group: {
      _id: null,
      avgPrice: { $avg: "$price" },
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" }
    }
  }
])
```
</details>

---

## Reflection Questions

1. What's the difference between `find()` and `findOne()`?
2. When would you use `$gt` vs `$gte`?
3. How does MongoDB handle queries on array fields differently than regular fields?
4. Why is dot notation important for querying nested documents?
5. What happens when you query a field that doesn't exist in some documents?

---

## Next Steps

Once you've completed this exercise:
- ✅ Document your learnings in a GitHub issue
- ✅ Try all query patterns in Compass
- ✅ Experiment with different filter combinations
- ✅ Move on to Exercise 03 - Update Documents

---

## Resources

- [MongoDB find() Documentation](https://docs.mongodb.com/manual/reference/method/db.collection.find/)
- [Query Operators Reference](https://docs.mongodb.com/manual/reference/operator/query/)
- [Dot Notation](https://docs.mongodb.com/manual/core/document/#dot-notation)
- [Query Arrays](https://docs.mongodb.com/manual/tutorial/query-arrays/)

---

**Remember: The best way to learn is by experimenting! Try variations of these queries! 🔍**

