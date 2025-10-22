# Exercise 07 - Array Operations

**Difficulty**: ⭐⭐ Intermediate  
**Topics**: Array queries, $push, $pull, $addToSet, array update operators  
**Estimated Time**: 35 minutes

---

## Learning Objectives

By completing this exercise, you will:
- ✅ Query documents by array elements
- ✅ Add elements to arrays ($push, $addToSet)
- ✅ Remove elements from arrays ($pull, $pop)
- ✅ Update specific array elements
- ✅ Work with arrays of objects
- ✅ Use array operators effectively

---

## Prerequisites

- Completed Exercises 01-06
- Understanding of CRUD and embedded documents
- Familiarity with update operators

---

## Part 1: Creating Documents with Arrays

### Task 1.1: Product with Tags Array

Insert a product with multiple tags:

```javascript
{
  sku: "CAMERA-CANON-EOS-R5",
  name: "Canon EOS R5",
  category: "Electronics",
  price: 3899.00,
  tags: ["camera", "professional", "mirrorless", "4k", "canon"],
  features: ["45MP sensor", "8K video", "IBIS", "Dual card slots"],
  status: "active"
}
```

**Collection**: `products`

---

### Task 1.2: User with Array of Interests

Insert a user with interests array:

```javascript
{
  name: { first: "Lisa", last: "Chen" },
  email: "lisa.chen@example.com",
  interests: ["photography", "travel", "technology", "cooking"],
  favoriteProducts: [],  // Empty array
  role: "customer",
  status: "active"
}
```

**Collection**: `users`

---

## Part 2: Querying Arrays

### Task 2.1: Find by Single Array Element

Find products tagged with "camera".

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({ tags: "camera" })
```

MongoDB automatically searches within arrays!
</details>

---

### Task 2.2: Find by Multiple Elements (ANY)

Find products with ANY of these tags: "sale", "clearance", "discount".

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  tags: { $in: ["sale", "clearance", "discount"] }
})
```

`$in` matches if ANY value is in the array.
</details>

---

### Task 2.3: Find by Multiple Elements (ALL)

Find products that have ALL of these tags: "wireless", "premium".

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  tags: { $all: ["wireless", "premium"] }
})
```

`$all` requires ALL specified values to be present.
</details>

---

### Task 2.4: Find by Array Size

Find products with exactly 5 tags.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  tags: { $size: 5 }
})
```
</details>

---

### Task 2.5: Find Empty Arrays

Find users with no favorite products yet.

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({
  favoriteProducts: { $size: 0 }
})

// Or
db.users.find({
  favoriteProducts: []
})

// Or check if exists but empty
db.users.find({
  favoriteProducts: { $exists: true, $size: 0 }
})
```
</details>

---

## Part 3: Adding Elements to Arrays

### Task 3.1: Add Single Element ($push)

Add tag "featured" to Canon camera.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  { $push: { tags: "featured" } }
)
```

`$push` adds element to end of array.
</details>

---

### Task 3.2: Add Multiple Elements

Add tags "new-arrival" and "bestseller" to Canon camera.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  {
    $push: {
      tags: { $each: ["new-arrival", "bestseller"] }
    }
  }
)
```

`$each` with `$push` adds multiple elements.
</details>

---

### Task 3.3: Add Unique Element ($addToSet)

Add tag "premium" to Canon camera, but only if it doesn't already exist.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  { $addToSet: { tags: "premium" } }
)
```

`$addToSet` adds only if value doesn't exist (prevents duplicates).
</details>

---

### Task 3.4: Add Multiple Unique Elements

Add multiple tags, but only if they don't already exist:
- "high-end"
- "recommended"

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  {
    $addToSet: {
      tags: { $each: ["high-end", "recommended"] }
    }
  }
)
```
</details>

---

## Part 4: Removing Elements from Arrays

### Task 4.1: Remove Specific Element ($pull)

Remove tag "featured" from Canon camera.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  { $pull: { tags: "featured" } }
)
```

`$pull` removes ALL occurrences of the value.
</details>

---

### Task 4.2: Remove Multiple Elements

Remove tags "new-arrival" and "sale" from a product.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  { $pull: { tags: { $in: ["new-arrival", "sale"] } } }
)
```
</details>

---

### Task 4.3: Remove Last Element ($pop)

Remove the last tag from Canon camera.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  { $pop: { tags: 1 } }
)
```

`$pop: 1` removes last element, `$pop: -1` removes first element.
</details>

---

### Task 4.4: Remove First Element

Remove the first tag from Canon camera.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  { $pop: { tags: -1 } }
)
```
</details>

---

## Part 5: Arrays of Objects

### Task 5.1: Create Product with Reviews

Insert a product with embedded reviews array:

```javascript
{
  sku: "BOOK-MONGODB-GUIDE",
  name: "MongoDB: The Definitive Guide",
  category: "Books",
  price: 49.99,
  reviews: [
    {
      author: "Alice",
      rating: 5,
      comment: "Excellent book!",
      date: new Date("2024-01-15")
    },
    {
      author: "Bob",
      rating: 4,
      comment: "Very informative",
      date: new Date("2024-01-18")
    }
  ],
  status: "active"
}
```

**Collection**: `products`

---

### Task 5.2: Add Review to Product

Add a new review to the MongoDB book:

```javascript
{
  author: "Charlie",
  rating: 5,
  comment: "Best MongoDB resource!",
  date: new Date()
}
```

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "BOOK-MONGODB-GUIDE" },
  {
    $push: {
      reviews: {
        author: "Charlie",
        rating: 5,
        comment: "Best MongoDB resource!",
        date: new Date()
      }
    }
  }
)
```
</details>

---

### Task 5.3: Query Array of Objects

Find products with at least one 5-star review.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  "reviews.rating": 5
})
```

Queries nested fields in array elements!
</details>

---

### Task 5.4: Query with $elemMatch

Find products with reviews where:
- rating = 5 AND
- author = "Alice"

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  reviews: {
    $elemMatch: {
      rating: 5,
      author: "Alice"
    }
  }
})
```

`$elemMatch` ensures both conditions match the SAME array element.
</details>

---

## Part 6: Updating Array Elements

### Task 6.1: Update First Matching Element ($)

Update the rating of Alice's review to 5:

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  {
    sku: "BOOK-MONGODB-GUIDE",
    "reviews.author": "Alice"
  },
  {
    $set: { "reviews.$.rating": 5 }
  }
)
```

The `$` positional operator updates the first matching array element.
</details>

---

### Task 6.2: Update Specific Array Element by Index

Update the second review (index 1):

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "BOOK-MONGODB-GUIDE" },
  {
    $set: {
      "reviews.1.comment": "Updated comment"
    }
  }
)
```

Use array index directly: `reviews.1`
</details>

---

### Task 6.3: Remove Specific Object from Array

Remove Alice's review.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "BOOK-MONGODB-GUIDE" },
  {
    $pull: {
      reviews: { author: "Alice" }
    }
  }
)
```

`$pull` with an object removes matching objects from array.
</details>

---

## Part 7: Advanced Array Operations

### Task 7.1: Add with Position

Add a new tag "editor-choice" at the beginning of the tags array.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  {
    $push: {
      tags: {
        $each: ["editor-choice"],
        $position: 0
      }
    }
  }
)
```

`$position: 0` inserts at the beginning.
</details>

---

### Task 7.2: Add and Sort

Add new tags and sort the array alphabetically.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  {
    $push: {
      tags: {
        $each: ["new-tag-1", "new-tag-2"],
        $sort: 1
      }
    }
  }
)
```

`$sort: 1` sorts ascending, `$sort: -1` sorts descending.
</details>

---

### Task 7.3: Add and Limit Array Size

Add new reviews but keep only the 5 most recent (by date).

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "BOOK-MONGODB-GUIDE" },
  {
    $push: {
      reviews: {
        $each: [{
          author: "Dave",
          rating: 4,
          comment: "Good book",
          date: new Date()
        }],
        $sort: { date: -1 },
        $slice: 5
      }
    }
  }
)
```

`$slice: 5` keeps only first 5 elements after sorting.
Negative number keeps last N elements.
</details>

---

## Part 8: Real-World Scenarios

### Scenario 1: Shopping Cart

User adds product to cart:

```javascript
// Add to cart
db.users.updateOne(
  { email: "user@example.com" },
  {
    $push: {
      cart: {
        productId: ObjectId("..."),
        quantity: 1,
        addedAt: new Date()
      }
    }
  }
)
```

---

### Scenario 2: Remove from Cart

User removes product from cart:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $pull: {
      cart: { productId: ObjectId("...") }
    }
  }
)
```

---

### Scenario 3: Update Cart Quantity

Update quantity of specific cart item:

```javascript
db.users.updateOne(
  {
    email: "user@example.com",
    "cart.productId": ObjectId("...")
  },
  {
    $set: { "cart.$.quantity": 3 }
  }
)
```

---

### Scenario 4: Wishlist Management

Toggle product in wishlist (add if not present, remove if present):

```javascript
// Check if exists
const user = db.users.findOne({
  email: "user@example.com",
  wishlist: productId
})

if (user) {
  // Remove
  db.users.updateOne(
    { email: "user@example.com" },
    { $pull: { wishlist: productId } }
  )
} else {
  // Add
  db.users.updateOne(
    { email: "user@example.com" },
    { $addToSet: { wishlist: productId } }
  )
}
```

---

## Validation & Testing

### Verify Array Operations

```javascript
// Check array after adding
db.products.findOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  { tags: 1 }
)

// Count array elements
db.products.findOne(
  { sku: "CAMERA-CANON-EOS-R5" },
  { tagCount: { $size: "$tags" } }
)

// Check for specific element
db.products.findOne({
  sku: "CAMERA-CANON-EOS-R5",
  tags: "premium"
})
```

---

## Common Mistakes to Avoid

❌ **Using $push without $each** for multiple elements  
✅ **Correct**: `$push: { array: { $each: [item1, item2] } }`

❌ **Confusing $in with $all**  
✅ **$in**: ANY match, **$all**: ALL must match

❌ **Forgetting $elemMatch** for complex array queries  
✅ **Use $elemMatch** when multiple conditions must match same element

❌ **Modifying arrays with $set** on entire array  
✅ **Use array operators**: $push, $pull, $addToSet

❌ **Not checking if element exists** before adding  
✅ **Use $addToSet** for uniqueness

---

## Success Criteria

- [ ] Can query arrays by elements ($in, $all, $size)
- [ ] Can add elements to arrays ($push, $addToSet)
- [ ] Can remove elements from arrays ($pull, $pop)
- [ ] Understand difference between $in and $all
- [ ] Can work with arrays of objects
- [ ] Can update specific array elements ($, position)
- [ ] Use $elemMatch for complex array queries

---

## Array Operations Summary

### Adding
```javascript
$push           // Add element(s)
$addToSet       // Add unique element(s)
$each           // Modifier for multiple elements
$position       // Modifier for insertion position
$sort           // Modifier to sort array
$slice          // Modifier to limit array size
```

### Removing
```javascript
$pull           // Remove matching element(s)
$pop            // Remove first (- 1) or last (1)
$pullAll        // Remove all specified values
```

### Querying
```javascript
$in             // Match ANY value
$all            // Match ALL values
$size           // Match array size
$elemMatch      // Match complex conditions
```

### Updating
```javascript
$               // Positional operator (first match)
array.N         // Update by index
$[]             // All elements (not covered yet)
```

---

## Additional Challenges (Optional)

### Challenge 1: Product Recommendations

Create a system where each product has an array of recommended product IDs:

```javascript
{
  sku: "LAPTOP-DELL-XPS13",
  recommendedProducts: [
    ObjectId("mouse_id"),
    ObjectId("bag_id"),
    ObjectId("adapter_id")
  ]
}
```

Add/remove recommendations dynamically.

### Challenge 2: Order History

Create user with order history (array of order references):

```javascript
{
  email: "user@example.com",
  orderHistory: [
    {
      orderId: ObjectId("..."),
      date: new Date(),
      total: 99.99,
      status: "delivered"
    }
  ]
}
```

---

## Reflection Questions

1. What's the difference between $push and $addToSet?
2. When would you use $elemMatch?
3. How does the positional $ operator work?
4. What's the maximum array size you should embed in a document?
5. When should you use references instead of embedded arrays?

---

## Next Steps

Once you've completed this exercise:
- ✅ Master array operations
- ✅ Know when to embed vs reference arrays
- ✅ Practice with real-world scenarios
- ✅ Move on to Exercise 08 - Complex Updates

---

## Resources

- [MongoDB Array Operators](https://docs.mongodb.com/manual/reference/operator/update-array/)
- [Query Arrays](https://docs.mongodb.com/manual/tutorial/query-arrays/)
- [$elemMatch Documentation](https://docs.mongodb.com/manual/reference/operator/query/elemMatch/)
- [Positional Operator $](https://docs.mongodb.com/manual/reference/operator/update/positional/)

---

**Arrays are powerful but use them wisely - don't embed unbounded data! 📊**

