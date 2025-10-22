# Exercise 08 - Complex Updates

**Difficulty**: ⭐⭐⭐ Advanced  
**Topics**: Combining operators, atomic updates, conditional updates, bulk operations  
**Estimated Time**: 40 minutes

---

## Learning Objectives

By completing this exercise, you will:
- ✅ Combine multiple update operators
- ✅ Perform conditional updates
- ✅ Use update modifiers ($setOnInsert, $min, $max)
- ✅ Execute bulk write operations
- ✅ Handle concurrent updates safely
- ✅ Apply advanced update patterns

---

## Prerequisites

- Completed Exercises 01-07
- Strong understanding of update operators
- Familiarity with arrays and embedded documents

---

## Part 1: Combining Multiple Operators

### Task 1.1: Multi-Operation Update

For a product, do ALL of these in ONE update:
- Increase price by $50 ($inc)
- Add tag "premium" ($addToSet)
- Set status to "active" ($set)
- Set lastUpdated to current date ($currentDate)

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  {
    $inc: { price: 50 },
    $addToSet: { tags: "premium" },
    $set: { status: "active" },
    $currentDate: { lastUpdated: true }
  }
)
```

Multiple operators can be combined in one update!
</details>

---

### Task 1.2: Update Nested and Array Together

For a user, update:
- City in address (nested)
- Add "photography" to interests (array)
- Increment login count

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: { "address.city": "Boston" },
    $addToSet: { interests: "photography" },
    $inc: { loginCount: 1 }
  }
)
```
</details>

---

## Part 2: Conditional Update Operators

### Task 2.1: $min Operator

Update price only if new value is LOWER than current:

**Scenario**: Set price to $899, but only if current price is higher.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  { $min: { price: 899 } }
)
```

`$min` updates only if new value is less than current value.
</details>

---

### Task 2.2: $max Operator

Update quantity only if new value is HIGHER:

**Scenario**: Set quantity to 100, but only if current is lower.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  { $max: { quantity: 100 } }
)
```

`$max` updates only if new value is greater than current value.
</details>

---

### Task 2.3: Price Floor and Ceiling

Set price constraints:
- Minimum price: $49.99 ($min)
- Maximum discount: can't go below 10% of original ($max on discountPercent)

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
// Ensure price doesn't go below minimum
db.products.updateOne(
  { sku: "LAPTOP-DELL-XPS13" },
  {
    $max: { price: 49.99 },
    $min: { discountPercent: 90 }  // Can't discount more than 90%
  }
)
```
</details>

---

## Part 3: $setOnInsert with Upsert

### Task 3.1: Create or Update with Defaults

Upsert a user:
- Set name and email (always)
- Set createdAt only on insert (not on update)

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "new.user@example.com" },
  {
    $set: {
      name: { first: "New", last: "User" },
      email: "new.user@example.com",
      status: "active"
    },
    $setOnInsert: {
      createdAt: new Date(),
      role: "customer"
    }
  },
  { upsert: true }
)
```

`$setOnInsert` only sets fields if document is being inserted.
On update, these fields are NOT modified.
</details>

---

### Task 3.2: Track First and Last Seen

Track user activity:
- Always update lastSeen
- Set firstSeen only on first insert

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: { lastSeen: new Date() },
    $setOnInsert: { firstSeen: new Date() }
  },
  { upsert: true }
)
```
</details>

---

## Part 4: Bulk Write Operations

### Task 4.1: Multiple Updates in One Call

Update multiple products at once:

```javascript
db.products.bulkWrite([
  {
    updateOne: {
      filter: { sku: "PRODUCT-001" },
      update: { $set: { status: "active" } }
    }
  },
  {
    updateOne: {
      filter: { sku: "PRODUCT-002" },
      update: { $inc: { quantity: 10 } }
    }
  },
  {
    insertOne: {
      document: {
        sku: "PRODUCT-003",
        name: "New Product",
        price: 99.99
      }
    }
  }
])
```

**Benefits**:
- Single network round-trip
- Better performance
- Ordered or unordered execution

---

### Task 4.2: Bulk Upsert

Upsert multiple products:

```javascript
db.products.bulkWrite([
  {
    updateOne: {
      filter: { sku: "SKU-001" },
      update: { $set: { name: "Product 1", price: 29.99 } },
      upsert: true
    }
  },
  {
    updateOne: {
      filter: { sku: "SKU-002" },
      update: { $set: { name: "Product 2", price: 39.99 } },
      upsert: true
    }
  }
])
```

---

## Part 5: Atomic Operations

### Task 5.1: Increment and Return

Implement a counter (like for order numbers):

```javascript
// Find and modify atomically
const result = db.counters.findAndModify({
  query: { _id: "orderNumber" },
  update: { $inc: { sequence: 1 } },
  new: true,  // Return updated document
  upsert: true
})

const nextOrderNumber = result.sequence
```

**Why atomic?** Prevents race conditions in concurrent environments.

---

### Task 5.2: Reserve Inventory

Decrement inventory atomically (only if enough stock):

```javascript
const result = db.products.updateOne(
  {
    sku: "LAPTOP-DELL-XPS13",
    quantity: { $gte: 5 }  // Only if at least 5 in stock
  },
  {
    $inc: { quantity: -5 }  // Reserve 5 units
  }
)

if (result.modifiedCount === 0) {
  // Not enough inventory
  throw new Error("Insufficient stock")
}
```

**Why important?** Prevents overselling in concurrent orders.

---

## Part 6: Conditional Logic with $cond (Preview)

### Task 6.1: Set Status Based on Quantity

Using aggregation pipeline in update (MongoDB 4.2+):

```javascript
db.products.updateMany(
  {},
  [
    {
      $set: {
        status: {
          $cond: {
            if: { $gt: ["$quantity", 0] },
            then: "in-stock",
            else: "out-of-stock"
          }
        }
      }
    }
  ]
)
```

**Note**: Array syntax `[...]` uses aggregation pipeline.

---

## Part 7: Real-World Patterns

### Pattern 1: Shopping Cart - Add or Update Quantity

Add item to cart or increment quantity if already exists:

```javascript
// Check if item exists in cart
const user = db.users.findOne({
  email: "user@example.com",
  "cart.productId": productId
})

if (user) {
  // Increment quantity
  db.users.updateOne(
    {
      email: "user@example.com",
      "cart.productId": productId
    },
    {
      $inc: { "cart.$.quantity": 1 }
    }
  )
} else {
  // Add new item
  db.users.updateOne(
    { email: "user@example.com" },
    {
      $push: {
        cart: {
          productId: productId,
          quantity: 1,
          addedAt: new Date()
        }
      }
    }
  )
}
```

---

### Pattern 2: Product View Counter with Last Viewed

Track product views and last viewed date:

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  {
    $inc: { viewCount: 1 },
    $set: { lastViewed: new Date() },
    $setOnInsert: { firstViewed: new Date() }
  },
  { upsert: true }
)
```

---

### Pattern 3: Average Rating Calculation

Update product rating when review is added:

```javascript
// Simplified version (better done with aggregation)
db.products.updateOne(
  { sku: "LAPTOP-DELL-XPS13" },
  {
    $inc: { 
      "rating.count": 1,
      "rating.total": 5  // New rating value
    }
  }
)

// Then calculate average
const product = db.products.findOne({ sku: "LAPTOP-DELL-XPS13" })
const average = product.rating.total / product.rating.count

db.products.updateOne(
  { sku: "LAPTOP-DELL-XPS13" },
  { $set: { "rating.average": average } }
)
```

---

### Pattern 4: Soft Delete with Timestamp

Mark document as deleted instead of removing:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      status: "deleted",
      deletedAt: new Date(),
      deletedBy: adminUserId
    }
  }
)
```

---

### Pattern 5: Versioning

Increment version on each update:

```javascript
db.products.updateOne(
  { sku: "LAPTOP-DELL-XPS13" },
  {
    $set: {
      name: "Updated Name",
      price: 1399.99
    },
    $inc: { __v: 1 },
    $currentDate: { updatedAt: true }
  }
)
```

---

## Part 8: Error Handling and Validation

### Task 8.1: Check Update Results

Always verify update results:

```javascript
const result = db.products.updateOne(
  { sku: "NON-EXISTENT" },
  { $set: { status: "active" } }
)

if (result.matchedCount === 0) {
  console.log("Product not found")
} else if (result.modifiedCount === 0) {
  console.log("No changes made (already had those values)")
} else {
  console.log("Updated successfully")
}
```

---

### Task 8.2: Validate Before Update

Check conditions before updating:

```javascript
// Check if user has permission
const user = db.users.findOne({
  email: "user@example.com",
  role: "admin"
})

if (!user) {
  throw new Error("Unauthorized")
}

// Then perform update
db.products.updateOne(...)
```

---

## Part 9: Performance Considerations

### Task 9.1: Batch Updates vs Individual

**Bad** (Multiple network calls):
```javascript
products.forEach(product => {
  db.products.updateOne(
    { _id: product._id },
    { $set: { status: "active" } }
  )
})
```

**Good** (Single network call):
```javascript
db.products.updateMany(
  { _id: { $in: productIds } },
  { $set: { status: "active" } }
)
```

---

### Task 9.2: Update with Index

Ensure filters use indexed fields:

```javascript
// Good - uses indexed field (sku)
db.products.updateOne(
  { sku: "LAPTOP-DELL-XPS13" },
  { $set: { status: "active" } }
)

// Bad - full collection scan if name not indexed
db.products.updateOne(
  { name: "Dell XPS 13" },
  { $set: { status: "active" } }
)
```

Create index on frequently queried fields!

---

## Validation & Testing

### Test Complex Updates

```javascript
// Before
const before = db.products.findOne({ sku: "TEST-SKU" })

// Update
db.products.updateOne(
  { sku: "TEST-SKU" },
  {
    $inc: { price: 10 },
    $addToSet: { tags: "new-tag" },
    $set: { status: "active" }
  }
)

// After
const after = db.products.findOne({ sku: "TEST-SKU" })

// Verify
assert(after.price === before.price + 10)
assert(after.tags.includes("new-tag"))
assert(after.status === "active")
```

---

## Common Mistakes to Avoid

❌ **Overwriting with $set on nested object** instead of using dot notation  
✅ **Use dot notation** for partial updates

❌ **Not checking matchedCount/modifiedCount**  
✅ **Always verify** update results

❌ **Not using atomic operations** for counters  
✅ **Use $inc** for race-condition-free counters

❌ **Updating in loops** instead of bulk operations  
✅ **Use updateMany or bulkWrite**

❌ **Not considering concurrent updates**  
✅ **Design for atomicity** and use appropriate operators

---

## Success Criteria

- [ ] Can combine multiple update operators in one operation
- [ ] Understand $min, $max, $setOnInsert
- [ ] Can perform upserts correctly
- [ ] Understand atomic operations and race conditions
- [ ] Can use bulkWrite for multiple operations
- [ ] Know when to use which update pattern
- [ ] Check update results properly

---

## Advanced Challenges (Optional)

### Challenge 1: Implement Like System

Build a like/unlike toggle:

```javascript
function toggleLike(productId, userId) {
  const product = db.products.findOne({
    _id: productId,
    likedBy: userId
  })
  
  if (product) {
    // Unlike
    db.products.updateOne(
      { _id: productId },
      {
        $pull: { likedBy: userId },
        $inc: { likeCount: -1 }
      }
    )
  } else {
    // Like
    db.products.updateOne(
      { _id: productId },
      {
        $addToSet: { likedBy: userId },
        $inc: { likeCount: 1 }
      }
    )
  }
}
```

### Challenge 2: Inventory Management

Reserve inventory with timeout:

```javascript
// Reserve
db.products.updateOne(
  {
    sku: "PRODUCT-SKU",
    availableQuantity: { $gte: quantity }
  },
  {
    $inc: {
      availableQuantity: -quantity,
      reservedQuantity: quantity
    },
    $push: {
      reservations: {
        userId: userId,
        quantity: quantity,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 min
      }
    }
  }
)

// Later, release expired reservations
db.products.updateMany(
  { "reservations.expiresAt": { $lt: new Date() } },
  {
    $pull: {
      reservations: { expiresAt: { $lt: new Date() } }
    }
    // Also increment availableQuantity accordingly
  }
)
```

---

## Summary: Advanced Update Patterns

### Operators
```javascript
$set            // Set field value
$inc            // Increment/decrement
$mul            // Multiply
$min            // Update if new value is lower
$max            // Update if new value is higher
$setOnInsert    // Set only on insert (with upsert)
$currentDate    // Set to current date
$unset          // Remove field
$rename         // Rename field
```

### Array Operators
```javascript
$push           // Add to array
$pull           // Remove from array
$addToSet       // Add unique to array
$pop            // Remove first/last
```

### Best Practices
- Use atomic operations for counters
- Batch updates when possible
- Always check update results
- Use appropriate operators for the task
- Consider concurrent access
- Index filter fields

---

## Next Steps

Once you've completed this exercise:
- ✅ Master complex update patterns
- ✅ Understand atomic operations
- ✅ Know performance implications
- ✅ Move on to Exercise 09 - Upsert Operations

---

## Resources

- [MongoDB Update Operators](https://docs.mongodb.com/manual/reference/operator/update/)
- [Bulk Write Operations](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/)
- [Atomic Operations](https://docs.mongodb.com/manual/core/write-operations-atomicity/)
- [findAndModify](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/)

---

**Master these patterns - they're crucial for production applications! 🎯**

