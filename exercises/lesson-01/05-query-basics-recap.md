# Exercise 05 - Query Basics (Comprehensive Recap)

**Difficulty**: ⭐⭐ Intermediate  
**Topics**: Comprehensive CRUD review, complex queries, real-world scenarios  
**Estimated Time**: 45 minutes

---

## Learning Objectives

By completing this exercise, you will:
- ✅ Combine all CRUD operations in realistic scenarios
- ✅ Build complex queries with multiple conditions
- ✅ Use logical operators ($and, $or, $not)
- ✅ Query arrays and nested documents effectively
- ✅ Apply best practices from Exercises 01-04

---

## Prerequisites

- Completed Exercises 01-04
- Solid understanding of CRUD operations
- Comfortable with query operators

---

## Part 1: Complex Queries

### Task 1.1: Find Premium Customers

Find all users who are:
- Role: "customer"
- Status: "active"
- Have newsletter preference enabled

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({
  role: "customer",
  status: "active",
  "preferences.newsletter": true
})
```
</details>

---

### Task 1.2: Find Products in Price Range by Category

Find Electronics products with price between $100 and $500.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  category: "Electronics",
  price: {
    $gte: 100,
    $lte: 500
  }
})
```
</details>

---

### Task 1.3: Exclude Specific Status

Find all products EXCEPT those with status "archived".

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  status: { $ne: "archived" }
})

// Or using $not
db.products.find({
  status: { $not: { $eq: "archived" } }
})
```
</details>

---

## Part 2: Logical Operators

### Task 2.1: OR Condition

Find users who are EITHER admins OR have status "inactive".

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({
  $or: [
    { role: "admin" },
    { status: "inactive" }
  ]
})
```
</details>

---

### Task 2.2: Complex AND/OR

Find products that are:
- (Category "Electronics" OR "Accessories")
- AND price < $200
- AND status "active"

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  $or: [
    { category: "Electronics" },
    { category: "Accessories" }
  ],
  price: { $lt: 200 },
  status: "active"
})
```
</details>

---

### Task 2.3: NOT Operator

Find products that do NOT have tag "discontinued".

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  tags: { $ne: "discontinued" }
})

// Or ensure tag doesn't exist at all
db.products.find({
  tags: { $not: { $in: ["discontinued"] } }
})
```
</details>

---

## Part 3: Array Queries

### Task 3.1: Multiple Tags (ALL)

Find products that have ALL of these tags:
- "wireless"
- "premium"
- "bluetooth"

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  tags: { $all: ["wireless", "premium", "bluetooth"] }
})
```
</details>

---

### Task 3.2: Any of Multiple Tags (IN)

Find products with ANY of these tags:
- "sale"
- "clearance"
- "discount"

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  tags: { $in: ["sale", "clearance", "discount"] }
})
```
</details>

---

### Task 3.3: Array Size

Find products with exactly 3 tags.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  tags: { $size: 3 }
})
```
</details>

---

## Part 4: Exists and Type Queries

### Task 4.1: Check Field Exists

Find all products that have a `compareAtPrice` field (sale items).

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  compareAtPrice: { $exists: true }
})
```
</details>

---

### Task 4.2: Check Field Doesn't Exist

Find users without a phone number.

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({
  phone: { $exists: false }
})

// Or is null
db.users.find({
  $or: [
    { phone: { $exists: false } },
    { phone: null }
  ]
})
```
</details>

---

### Task 4.3: Type Check

Find documents where price is stored as a string (data quality issue).

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  price: { $type: "string" }
})

// Type codes: "string" = 2, "double" = 1, "int" = 16
```
</details>

---

## Part 5: Real-World Scenarios

### Scenario 1: Product Catalog Search

**Goal**: Build a product search with filters

Find products where:
- Name contains "laptop" (case-insensitive)
- Price between $800 and $2000
- Status is "active"
- Has at least 1 tag

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  name: { $regex: /laptop/i },
  price: { $gte: 800, $lte: 2000 },
  status: "active",
  tags: { $exists: true, $ne: [] }
})
```
</details>

---

### Scenario 2: Customer Segmentation

**Goal**: Find VIP customers for marketing campaign

Find users where:
- Role is "customer"
- Status is "active"
- Newsletter preference is true
- NOT from test emails (email doesn't contain "test" or "delete")

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({
  role: "customer",
  status: "active",
  "preferences.newsletter": true,
  email: {
    $not: { $regex: /(test|delete)/i }
  }
})
```
</details>

---

### Scenario 3: Inventory Check

**Goal**: Find products that need restocking

Find products where:
- Status is "active"
- Either:
  - quantity < 10 OR
  - quantity field doesn't exist

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  status: "active",
  $or: [
    { quantity: { $lt: 10 } },
    { quantity: { $exists: false } }
  ]
})
```
</details>

---

## Part 6: Aggregated Updates

### Scenario 4: Bulk Status Update

**Goal**: Archive old products

Update all products where:
- Status is "active"
- Created more than 1 year ago (if you have createdAt)
- Change status to "archived"

<details>
<summary>💡 Solution</summary>

```javascript
const oneYearAgo = new Date()
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

db.products.updateMany(
  {
    status: "active",
    createdAt: { $lt: oneYearAgo }
  },
  {
    $set: {
      status: "archived",
      archivedAt: new Date()
    }
  }
)
```
</details>

---

### Scenario 5: Price Adjustment

**Goal**: Apply discount to specific products

For all products:
- In "Electronics" category
- Price > $200
- Tagged "sale"

Apply:
- 15% discount (multiply price by 0.85)
- Add "discounted" tag
- Set saleEnds date

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateMany(
  {
    category: "Electronics",
    price: { $gt: 200 },
    tags: "sale"
  },
  {
    $mul: { price: 0.85 },
    $addToSet: { tags: "discounted" },
    $set: {
      saleEnds: ISODate("2024-02-01T00:00:00Z")
    }
  }
)
```
</details>

---

## Part 7: Data Cleanup

### Scenario 6: Remove Test Data

**Goal**: Clean up test accounts

Delete all users where:
- Email contains "test" or "delete"
- OR status is "test"

<details>
<summary>💡 Solution</summary>

```javascript
// ALWAYS preview first!
db.users.find({
  $or: [
    { email: { $regex: /(test|delete)/i } },
    { status: "test" }
  ]
})

// Count them
db.users.countDocuments({
  $or: [
    { email: { $regex: /(test|delete)/i } },
    { status: "test" }
  ]
})

// If looks correct, delete
db.users.deleteMany({
  $or: [
    { email: { $regex: /(test|delete)/i } },
    { status: "test" }
  ]
})
```
</details>

---

## Part 8: Performance Queries

### Task 8.1: Count by Category

Count products in each status.

<details>
<summary>💡 Solution (Preview of Aggregation)</summary>

```javascript
db.products.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
])
```
</details>

---

### Task 8.2: Find Most Expensive Product

Find the product with highest price.

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find().sort({ price: -1 }).limit(1)
```
</details>

---

### Task 8.3: Recent Users

Find the 10 most recently created users.

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find().sort({ createdAt: -1 }).limit(10)
```
</details>

---

## Part 9: Validation Challenge

### Challenge: E-commerce Dashboard Query

Write a SINGLE query (or multiple queries) to get:

1. Total number of active products
2. Total number of active customers
3. Products in "Electronics" category
4. Products with price > $1000

<details>
<summary>💡 Solution</summary>

```javascript
// 1. Active products count
const activeProducts = db.products.countDocuments({ status: "active" })

// 2. Active customers count
const activeCustomers = db.users.countDocuments({
  role: "customer",
  status: "active"
})

// 3. Electronics products
const electronics = db.products.find({ category: "Electronics" }).toArray()

// 4. Expensive products
const expensive = db.products.find({ price: { $gt: 1000 } }).toArray()

// Display results
print(`Active Products: ${activeProducts}`)
print(`Active Customers: ${activeCustomers}`)
print(`Electronics: ${electronics.length}`)
print(`Expensive Products: ${expensive.length}`)
```
</details>

---

## Part 10: Best Practices Review

### Task 10.1: Efficient Query Writing

Which is more efficient?

```javascript
// Option A
db.users.find({ role: "customer" }).toArray().filter(u => u.status === "active")

// Option B
db.users.find({ role: "customer", status: "active" })
```

<details>
<summary>💡 Answer</summary>

**Option B** is MUCH more efficient!

- Option A retrieves ALL customers, then filters in application code
- Option B filters in database, returning only needed documents
- Always push filtering to the database level
</details>

---

### Task 10.2: Index Awareness

If you frequently query by email, what should you do?

<details>
<summary>💡 Answer</summary>

Create an index!

```javascript
db.users.createIndex({ email: 1 })
```

This makes queries by email much faster.
We'll learn more about indexes in Lesson 03!
</details>

---

## Validation & Testing

### Complete Validation Checklist

Test your understanding:

- [ ] Can combine multiple conditions in queries
- [ ] Understand $and, $or, $not operators
- [ ] Can query arrays effectively
- [ ] Can check field existence and type
- [ ] Can build complex real-world queries
- [ ] Know when to use each CRUD operation
- [ ] Understand performance implications

---

## Success Criteria

- [ ] Completed all 10 parts
- [ ] All queries return expected results
- [ ] Understand logical operators
- [ ] Can query nested fields and arrays
- [ ] Applied best practices
- [ ] Ready for intermediate topics!

---

## Additional Challenges (Optional)

### Challenge 1: Full CRUD Workflow

Implement a complete user lifecycle:

1. Create new user
2. Find and verify user
3. Update user preferences
4. User makes purchase (add to orders)
5. Soft delete user account
6. Query to exclude deleted users

### Challenge 2: Product Management

Implement product management workflow:

1. Add new product
2. Update price and add to sale
3. Add product reviews (if you have reviews collection)
4. Find all sale products
5. Archive old products
6. Generate inventory report

---

## Reflection Questions

1. When should you use find() vs findOne()?
2. How do you build queries that check multiple conditions?
3. What's the difference between $in and $all for arrays?
4. Why is it important to push filtering to the database?
5. What patterns did you learn for safe data operations?

---

## Summary: CRUD Operations

### Create
```javascript
insertOne(doc)
insertMany([docs])
```

### Read
```javascript
find(filter)
findOne(filter)
countDocuments(filter)
```

### Update
```javascript
updateOne(filter, update)
updateMany(filter, update)
replaceOne(filter, doc)
```

### Delete
```javascript
deleteOne(filter)
deleteMany(filter)
```

---

## Next Steps

Congratulations on completing Part 1 of Lesson 01! 🎉

You now have solid CRUD fundamentals. Next:

- ✅ Review any challenging concepts
- ✅ Document learnings in GitHub issue
- ✅ Take a break! ☕
- ✅ Move on to Part 2: Intermediate Topics (Exercises 06-10)

---

## Resources

- [MongoDB Query Documentation](https://docs.mongodb.com/manual/tutorial/query-documents/)
- [MongoDB Update Documentation](https://docs.mongodb.com/manual/tutorial/update-documents/)
- [Query Operators Reference](https://docs.mongodb.com/manual/reference/operator/query/)
- [Update Operators Reference](https://docs.mongodb.com/manual/reference/operator/update/)

---

**Excellent work! You're becoming a MongoDB pro! 🚀**

