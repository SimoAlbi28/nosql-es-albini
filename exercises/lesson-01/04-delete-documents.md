# Exercise 04 - Delete Documents

**Difficulty**: ⭐ Beginner  
**Topics**: deleteOne, deleteMany, safe deletion patterns  
**Estimated Time**: 20 minutes

---

## Learning Objectives

By completing this exercise, you will:
- ✅ Use `deleteOne()` to remove a single document
- ✅ Use `deleteMany()` to remove multiple documents
- ✅ Understand deletion is permanent (no undo!)
- ✅ Learn safe deletion patterns (soft delete)
- ✅ Count documents before and after deletion

---

## ⚠️ Important Warning

**Deletion is PERMANENT!** There is no undo. Always:
1. Test your filter with `find()` first
2. Count how many will be deleted
3. Back up important data
4. Consider "soft delete" (status field) instead

---

## Prerequisites

- Completed Exercises 01, 02, and 03
- Documents exist in collections
- MongoDB Compass connected

---

## Part 1: Delete Single Documents

### Task 1.1: Create Test Documents First

Before practicing deletion, insert some test users we can safely delete:

```javascript
db.users.insertMany([
  {
    name: { first: "Test", last: "User1" },
    email: "test1@delete.com",
    role: "customer",
    status: "test"
  },
  {
    name: { first: "Test", last: "User2" },
    email: "test2@delete.com",
    role: "customer",
    status: "test"
  },
  {
    name: { first: "Test", last: "User3" },
    email: "test3@delete.com",
    role: "customer",
    status: "test"
  }
])
```

---

### Task 1.2: Preview Before Deleting

ALWAYS check what you're about to delete:

```javascript
// Find documents that match your delete filter
db.users.find({ status: "test" })

// Count them
db.users.countDocuments({ status: "test" })
```

**Question**: How many test users do you see?

---

### Task 1.3: Delete One Test User

Delete the user with email "test1@delete.com".

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.deleteOne({ email: "test1@delete.com" })
```

**Result**:
```javascript
{
  acknowledged: true,
  deletedCount: 1
}
```
</details>

---

### Task 1.4: Verify Deletion

Check the user is really gone:

```javascript
// Should return null
db.users.findOne({ email: "test1@delete.com" })

// Count remaining test users (should be 2)
db.users.countDocuments({ status: "test" })
```

---

## Part 2: Delete Multiple Documents

### Task 2.1: Delete Remaining Test Users

Delete ALL users with status "test".

**Collection**: `users`

**Expected**: 2 documents deleted

<details>
<summary>💡 Solution</summary>

```javascript
// ALWAYS preview first!
db.users.find({ status: "test" })

// Then delete
db.users.deleteMany({ status: "test" })
```

**Result**:
```javascript
{
  acknowledged: true,
  deletedCount: 2
}
```
</details>

---

### Task 2.2: Delete by Multiple Criteria

Create and then delete products with:
- Category: "Test"
- Price: < $10

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
// First insert test products
db.products.insertMany([
  {
    sku: "TEST-001",
    name: "Test Product 1",
    category: "Test",
    price: 5.99,
    status: "active"
  },
  {
    sku: "TEST-002",
    name: "Test Product 2",
    category: "Test",
    price: 8.99,
    status: "active"
  }
])

// Preview
db.products.find({ category: "Test", price: { $lt: 10 } })

// Delete
db.products.deleteMany({ category: "Test", price: { $lt: 10 } })
```
</details>

---

## Part 3: Conditional Deletion

### Task 3.1: Delete Inactive Users

Delete users where status is "inactive".

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
// Preview
db.users.find({ status: "inactive" })
db.users.countDocuments({ status: "inactive" })

// Delete
db.users.deleteMany({ status: "inactive" })
```
</details>

---

### Task 3.2: Delete Old Documents

Delete products created before a specific date (if you have createdAt field).

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
// Delete products created before Jan 1, 2024
db.products.deleteMany({
  createdAt: { $lt: ISODate("2024-01-01") }
})
```
</details>

---

## Part 4: Delete All Documents (Dangerous!)

### Task 4.1: Delete All Test Data

**Warning**: This deletes EVERYTHING in the collection!

Create a test collection first:

```javascript
// Create test collection
db.testCollection.insertMany([
  { name: "Item 1" },
  { name: "Item 2" },
  { name: "Item 3" }
])

// View all
db.testCollection.find()

// Delete ALL documents
db.testCollection.deleteMany({})

// Verify empty
db.testCollection.countDocuments()  // Should be 0
```

**Note**: `deleteMany({})` with empty filter deletes ALL documents!

---

## Part 5: Safe Deletion Patterns

### Task 5.1: Soft Delete (Recommended for Production)

Instead of deleting, mark documents as deleted:

```javascript
// "Delete" by updating status
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      status: "deleted",
      deletedAt: new Date()
    }
  }
)

// Query only active users
db.users.find({ status: { $ne: "deleted" } })
```

**Advantages**:
- ✅ Can be undone
- ✅ Maintains history
- ✅ Audit trail
- ✅ Can still query "deleted" data

---

### Task 5.2: Archive Before Delete

Move documents to archive collection before deleting:

```javascript
// Find document to archive
const user = db.users.findOne({ email: "archive@example.com" })

// Insert into archive
db.users_archive.insertOne({
  ...user,
  archivedAt: new Date()
})

// Then delete from main collection
db.users.deleteOne({ _id: user._id })
```

---

## Part 6: Deletion with Conditions

### Task 6.1: Delete Matching Nested Field

Delete users from a specific city.

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
// Preview
db.users.find({ "address.city": "TestCity" })

// Delete
db.users.deleteMany({ "address.city": "TestCity" })
```
</details>

---

### Task 6.2: Delete by Array Element

Delete products with a specific tag.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
// Preview
db.products.find({ tags: "discontinued" })

// Delete
db.products.deleteMany({ tags: "discontinued" })
```
</details>

---

## Part 7: Understanding Delete Results

### Task 7.1: Check Delete Results

Every delete operation returns information:

```javascript
const result = db.users.deleteMany({ status: "test" })

// Result object:
{
  acknowledged: true,     // Operation was acknowledged
  deletedCount: 5         // Number of documents deleted
}
```

**Important Fields**:
- `deletedCount`: How many documents were removed
- `acknowledged`: Whether operation was acknowledged by server

### Task 7.2: Handle No Matches

What happens when filter matches nothing?

```javascript
db.users.deleteOne({ email: "doesnotexist@example.com" })

// Result:
{
  acknowledged: true,
  deletedCount: 0    // Nothing deleted, but no error!
}
```

**Lesson**: Check `deletedCount` to know if anything was actually deleted!

---

## Validation & Testing

### Safe Deletion Checklist

Before any deletion:

```javascript
// 1. Preview what will be deleted
db.collection.find({ your: "filter" })

// 2. Count how many
const count = db.collection.countDocuments({ your: "filter" })
console.log(`About to delete ${count} documents`)

// 3. If count looks correct, delete
db.collection.deleteMany({ your: "filter" })

// 4. Verify result
// deletedCount should match your expectation
```

---

## Common Mistakes to Avoid

❌ **Deleting without preview**: ALWAYS use find() first!

❌ **Empty filter by accident**: `deleteMany({})` deletes EVERYTHING!

❌ **Wrong collection**: Double-check you're in the right collection!

❌ **No backup**: For production, always backup before bulk deletes

❌ **Not checking deletedCount**: Verify the operation did what you expected

✅ **Best practice**: Use soft delete (status field) instead of hard delete

---

## Success Criteria

- [ ] Can delete a single document with deleteOne()
- [ ] Can delete multiple documents with deleteMany()
- [ ] ALWAYS preview with find() before deleting
- [ ] Check deletedCount in results
- [ ] Understand deletion is permanent
- [ ] Know when to use soft delete instead
- [ ] Can delete by nested fields and array elements

---

## Additional Challenges (Optional)

### Challenge 1: Batch Deletion with Limit

MongoDB doesn't have a LIMIT option for delete, but you can work around it:

```javascript
// Delete only first 10 matching documents
const docsToDelete = db.collection.find({ status: "old" }).limit(10).toArray()
const idsToDelete = docsToDelete.map(doc => doc._id)

db.collection.deleteMany({ _id: { $in: idsToDelete } })
```

### Challenge 2: Delete with Relationships

When deleting a user, also delete their orders:

```javascript
// Get user _id
const user = db.users.findOne({ email: "user@example.com" })

// Delete user's orders
db.orders.deleteMany({ userId: user._id })

// Delete user
db.users.deleteOne({ _id: user._id })
```

**Question**: What if you want to keep orders for records?  
**Answer**: Use soft delete or archive pattern!

---

## Reflection Questions

1. Why is it important to preview with find() before deleting?
2. What's the difference between deleteOne() and deleteMany()?
3. When would you use soft delete instead of hard delete?
4. What happens if you call deleteMany({}) by mistake?
5. How can you implement "undo" functionality for deletions?

---

## Best Practices Summary

### Production Deletion Guidelines

1. **Soft Delete First**
   ```javascript
   { status: "deleted", deletedAt: Date }
   ```

2. **Archive Pattern**
   - Move to archive collection
   - Periodic cleanup of archives

3. **Cascading Deletes**
   - Plan for related documents
   - Use transactions if needed

4. **Audit Trail**
   - Log all deletions
   - Store who deleted and when

5. **Backup**
   - Regular backups
   - Test restore procedures

---

## Next Steps

Once you've completed this exercise:
- ✅ Understand dangers of deletion
- ✅ Practice soft delete patterns
- ✅ Always preview before deleting
- ✅ Move on to Exercise 05 - Query Basics (Recap)

---

## Resources

- [MongoDB deleteOne() Documentation](https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/)
- [MongoDB deleteMany() Documentation](https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/)
- [Data Modeling Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)

---

**Remember: With great DELETE power comes great responsibility! 🦸‍♂️**

