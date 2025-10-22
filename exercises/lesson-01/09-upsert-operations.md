# Exercise 09 - Upsert Operations

**Difficulty**: ⭐⭐ Intermediate  
**Topics**: Upsert pattern, $setOnInsert, idempotent operations  
**Estimated Time**: 25 minutes

---

## Learning Objectives

By completing this exercise, you will:
- ✅ Understand upsert (update or insert) pattern
- ✅ Use upsert option effectively
- ✅ Apply $setOnInsert for default values
- ✅ Build idempotent operations
- ✅ Handle race conditions with upserts

---

## What is Upsert?

**Upsert** = **Up**date or In**sert**

- If document matches filter → **Update** it
- If no document matches → **Insert** new one

**Use case**: When you don't know if document exists yet.

---

## Part 1: Basic Upsert

### Task 1.1: Simple Upsert

Create or update a user by email:

```javascript
db.users.updateOne(
  { email: "john.doe@example.com" },
  {
    $set: {
      name: { first: "John", last: "Doe" },
      status: "active"
    }
  },
  { upsert: true }  // The magic option!
)
```

**First run**: Creates new user (no user with that email exists)  
**Second run**: Updates existing user

**Collection**: `users`

---

### Task 1.2: Verify Upsert Behavior

Run the same upsert twice and observe results:

```javascript
// First run
const result1 = db.users.updateOne(
  { email: "jane.doe@example.com" },
  { $set: { name: "Jane Doe" } },
  { upsert: true }
)
console.log(result1)
// { upsertedId: ObjectId("..."), matchedCount: 0, modifiedCount: 0 }

// Second run (document now exists)
const result2 = db.users.updateOne(
  { email: "jane.doe@example.com" },
  { $set: { name: "Jane Doe Updated" } },
  { upsert: true }
)
console.log(result2)
// { matchedCount: 1, modifiedCount: 1 }
```

**Note the difference in result objects!**

---

## Part 2: $setOnInsert

### Task 2.1: Set Defaults on Creation

Create user with defaults, but don't override on updates:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      name: "User Name",
      lastLogin: new Date()  // Always update
    },
    $setOnInsert: {
      createdAt: new Date(),  // Only set on insert
      role: "customer",       // Only set on insert
      status: "active"        // Only set on insert
    }
  },
  { upsert: true }
)
```

**First run**: Sets everything  
**Second run**: Only updates `name` and `lastLogin`, NOT `createdAt`, `role`, or `status`

**Collection**: `users`

---

### Task 2.2: Track First and Last Activity

Track when user was first seen and last seen:

```javascript
db.users.updateOne(
  { email: "active.user@example.com" },
  {
    $set: {
      lastActive: new Date()
    },
    $setOnInsert: {
      firstSeen: new Date(),
      accountCreated: new Date()
    }
  },
  { upsert: true }
)
```

Run multiple times and verify `firstSeen` never changes but `lastActive` does.

---

## Part 3: Idempotent Operations

### Task 3.1: Idempotent Product Creation

Create product that can be run multiple times safely:

```javascript
db.products.updateOne(
  { sku: "PRODUCT-SKU-123" },  // Unique identifier
  {
    $set: {
      name: "Product Name",
      price: 99.99,
      status: "active",
      updatedAt: new Date()
    },
    $setOnInsert: {
      sku: "PRODUCT-SKU-123",
      createdAt: new Date(),
      viewCount: 0,
      salesCount: 0
    }
  },
  { upsert: true }
)
```

**Idempotent**: Running this multiple times has the same effect as running once.

**Collection**: `products`

---

### Task 3.2: API Request Logging

Log API requests idempotently (prevent duplicate logs):

```javascript
db.apiLogs.updateOne(
  {
    requestId: "unique-request-id-123",  // Unique per request
    endpoint: "/api/products"
  },
  {
    $set: {
      lastAttempt: new Date(),
      status: "completed"
    },
    $inc: {
      attemptCount: 1  // Track retries
    },
    $setOnInsert: {
      requestId: "unique-request-id-123",
      endpoint: "/api/products",
      firstAttempt: new Date(),
      userId: "user123"
    }
  },
  { upsert: true }
)
```

If request is retried, updates attempt info without creating duplicate log.

---

## Part 4: Counter Patterns

### Task 4.1: Initialize Counter

Create counter with default value:

```javascript
db.counters.updateOne(
  { _id: "orderNumber" },
  {
    $setOnInsert: {
      sequence: 1000  // Start at 1000
    }
  },
  { upsert: true }
)
```

**First run**: Creates counter at 1000  
**Subsequent runs**: Does nothing (counter already exists)

---

### Task 4.2: Increment or Initialize

Increment counter or create with initial value:

```javascript
db.counters.updateOne(
  { _id: "productViews" },
  {
    $inc: { count: 1 },
    $setOnInsert: {
      createdAt: new Date()
    }
  },
  { upsert: true }
)
```

**First run**: Creates with count: 1  
**Subsequent runs**: Increments count

---

## Part 5: Session Management

### Task 5.1: Create or Update Session

Typical web session management:

```javascript
db.sessions.updateOne(
  { sessionId: "session-abc-123" },
  {
    $set: {
      userId: "user123",
      lastActivity: new Date(),
      data: {
        cartItems: 3,
        currentPage: "/products"
      }
    },
    $setOnInsert: {
      createdAt: new Date(),
      sessionId: "session-abc-123"
    }
  },
  { upsert: true }
)
```

**First visit**: Creates session  
**Subsequent requests**: Updates session activity

---

### Task 5.2: Session with Expiry

Add automatic expiry:

```javascript
db.sessions.updateOne(
  { sessionId: "session-xyz-456" },
  {
    $set: {
      userId: "user456",
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)  // 30 minutes
    },
    $setOnInsert: {
      createdAt: new Date()
    }
  },
  { upsert: true }
)

// Create TTL index to auto-delete expired sessions
db.sessions.createIndex(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
)
```

---

## Part 6: Product Inventory

### Task 6.1: Initialize Inventory

Set up inventory record:

```javascript
db.inventory.updateOne(
  { sku: "LAPTOP-DELL-XPS13" },
  {
    $set: {
      sku: "LAPTOP-DELL-XPS13",
      lastUpdated: new Date()
    },
    $setOnInsert: {
      quantity: 100,
      reservedQuantity: 0,
      createdAt: new Date()
    }
  },
  { upsert: true }
)
```

**First run**: Initializes with 100 units  
**Updates**: Don't reset quantity

---

### Task 6.2: Reserve Inventory

Reserve inventory with upsert:

```javascript
// This would actually fail - just showing the pattern
db.inventory.updateOne(
  {
    sku: "LAPTOP-DELL-XPS13",
    quantity: { $gte: 5 }  // Only if enough stock
  },
  {
    $inc: {
      quantity: -5,
      reservedQuantity: 5
    },
    $set: {
      lastUpdated: new Date()
    }
  }
  // Note: NO upsert here! We don't want to create if doesn't exist
)
```

---

## Part 7: User Preferences

### Task 7.1: Set Preferences with Defaults

Update preferences or create with defaults:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      "preferences.theme": "dark",
      "preferences.lastUpdated": new Date()
    },
    $setOnInsert: {
      "preferences.language": "en",
      "preferences.notifications": true,
      "preferences.newsletter": false
    }
  },
  { upsert: true }
)
```

User can update theme anytime, but defaults are set only on first creation.

---

## Part 8: Avoiding Common Pitfalls

### Pitfall 1: Overwriting with $set

❌ **Wrong**:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      preferences: {
        theme: "dark"
      }
    }
  },
  { upsert: true }
)
```

This REPLACES entire preferences object!

✅ **Correct**:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      "preferences.theme": "dark"
    }
  },
  { upsert: true }
)
```

Use dot notation for partial updates!

---

### Pitfall 2: Not Using $setOnInsert for Timestamps

❌ **Wrong**:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      name: "User",
      createdAt: new Date()  // This updates createdAt every time!
    }
  },
  { upsert: true }
)
```

✅ **Correct**:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: { name: "User" },
    $setOnInsert: { createdAt: new Date() }
  },
  { upsert: true }
)
```

---

### Pitfall 3: Race Conditions

**Problem**: Two upserts at same time might create duplicates with non-unique filters.

**Solution**: Use unique index on filter field!

```javascript
// Create unique index
db.users.createIndex({ email: 1 }, { unique: true })

// Now upserts are safe from race conditions
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { name: "User" } },
  { upsert: true }
)
```

---

## Part 9: Real-World Patterns

### Pattern 1: Product View Counter

Track views per product:

```javascript
db.productStats.updateOne(
  {
    productId: ObjectId("..."),
    date: "2024-01-15"  // Daily stats
  },
  {
    $inc: { views: 1 },
    $setOnInsert: {
      productId: ObjectId("..."),
      date: "2024-01-15",
      createdAt: new Date()
    }
  },
  { upsert: true }
)
```

---

### Pattern 2: User Activity Tracking

Track user activity:

```javascript
db.userActivity.updateOne(
  {
    userId: ObjectId("..."),
    date: "2024-01-15"
  },
  {
    $inc: { loginCount: 1 },
    $set: { lastLogin: new Date() },
    $setOnInsert: {
      userId: ObjectId("..."),
      date: "2024-01-15",
      firstLogin: new Date()
    }
  },
  { upsert: true }
)
```

---

### Pattern 3: Cache Implementation

Implement cache with TTL:

```javascript
db.cache.updateOne(
  { key: "product-list-page-1" },
  {
    $set: {
      value: [...products],
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)  // 5 min
    },
    $setOnInsert: {
      createdAt: new Date()
    }
  },
  { upsert: true }
)
```

---

## Validation & Testing

### Test Upsert Behavior

```javascript
// Start fresh
db.testCollection.deleteMany({ testId: "test-1" })

// First upsert (insert)
const result1 = db.testCollection.updateOne(
  { testId: "test-1" },
  {
    $set: { value: "updated" },
    $setOnInsert: { created: new Date() }
  },
  { upsert: true }
)
console.log("First:", result1)
// Should show: upsertedId

// Second upsert (update)
const result2 = db.testCollection.updateOne(
  { testId: "test-1" },
  {
    $set: { value: "updated-again" },
    $setOnInsert: { created: new Date() }
  },
  { upsert: true }
)
console.log("Second:", result2)
// Should show: matchedCount: 1, modifiedCount: 1

// Verify
const doc = db.testCollection.findOne({ testId: "test-1" })
console.log("Final document:", doc)
// value should be "updated-again", created should be from first insert
```

---

## Success Criteria

- [ ] Understand upsert pattern (update or insert)
- [ ] Can use { upsert: true } option
- [ ] Know when to use $setOnInsert
- [ ] Can build idempotent operations
- [ ] Understand race condition risks
- [ ] Can apply upsert patterns to real scenarios

---

## Upsert Checklist

When using upsert:

- ✅ Filter on unique identifier (or unique index)
- ✅ Use $setOnInsert for creation-only fields
- ✅ Use $set for always-update fields
- ✅ Consider race conditions
- ✅ Check result (upsertedId vs matchedCount)
- ✅ Make operations idempotent

---

## Additional Challenges (Optional)

### Challenge 1: Rate Limiting

Implement rate limiting with upsert:

```javascript
const result = db.rateLimits.updateOne(
  {
    userId: "user123",
    hour: new Date().setMinutes(0, 0, 0)  // Current hour
  },
  {
    $inc: { requests: 1 },
    $setOnInsert: {
      userId: "user123",
      hour: new Date().setMinutes(0, 0, 0),
      createdAt: new Date()
    }
  },
  { upsert: true }
)

// Check if over limit
const rateLimit = db.rateLimits.findOne({
  userId: "user123",
  hour: new Date().setMinutes(0, 0, 0)
})

if (rateLimit.requests > 100) {
  throw new Error("Rate limit exceeded")
}
```

### Challenge 2: Leaderboard

Update leaderboard scores:

```javascript
db.leaderboard.updateOne(
  { userId: "user123" },
  {
    $max: { highScore: 1500 },  // Only update if higher
    $inc: { totalGames: 1 },
    $set: { lastPlayed: new Date() },
    $setOnInsert: {
      userId: "user123",
      username: "Player123",
      joinedAt: new Date()
    }
  },
  { upsert: true }
)
```

---

## Reflection Questions

1. What's the difference between update with upsert and insert?
2. When should you use $setOnInsert?
3. How can upserts cause race conditions?
4. Why is idempotency important for upserts?
5. How do you check if an upsert inserted or updated?

---

## Summary

### Upsert Basics
```javascript
db.collection.updateOne(
  { filter },
  { $set: { ... } },
  { upsert: true }  // The key option
)
```

### With $setOnInsert
```javascript
db.collection.updateOne(
  { filter },
  {
    $set: { /* always update */ },
    $setOnInsert: { /* only on insert */ }
  },
  { upsert: true }
)
```

### Result Checking
```javascript
const result = ...
if (result.upsertedId) {
  // Document was inserted
} else if (result.modifiedCount > 0) {
  // Document was updated
}
```

---

## Next Steps

Once you've completed this exercise:
- ✅ Master upsert pattern
- ✅ Know when to use $setOnInsert
- ✅ Build idempotent operations
- ✅ Move on to Exercise 10 - Comprehensive Challenge

---

## Resources

- [MongoDB Upsert](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#upsert-option)
- [$setOnInsert Documentation](https://docs.mongodb.com/manual/reference/operator/update/setOnInsert/)
- [Write Operation Atomicity](https://docs.mongodb.com/manual/core/write-operations-atomicity/)

---

**Upsert = Your best friend for "create or update" scenarios! 🎯**

