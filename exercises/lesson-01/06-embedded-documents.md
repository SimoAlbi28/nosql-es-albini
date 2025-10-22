# Exercise 06 - Embedded Documents

**Difficulty**: ⭐⭐ Intermediate  
**Topics**: Nested objects, dot notation, embedded document patterns  
**Estimated Time**: 30 minutes

---

## Learning Objectives

By completing this exercise, you will:
- ✅ Create documents with nested objects
- ✅ Query nested fields using dot notation
- ✅ Update embedded documents
- ✅ Understand when to embed vs reference
- ✅ Work with multiple levels of nesting

---

## Prerequisites

- Completed Exercises 01-05
- Understanding of CRUD operations
- Familiarity with document structure

---

## Part 1: Creating Embedded Documents

### Task 1.1: User with Complete Address

Insert a user with a fully structured address:

**Requirements**:
```javascript
{
  name: {
    first: "Jessica",
    last: "Taylor"
  },
  email: "jessica.taylor@example.com",
  phone: "+1-555-0166",
  address: {
    street: "456 Oak Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "USA",
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    }
  },
  role: "customer",
  status: "active"
}
```

**Collection**: `users`

**Note**: Address contains a nested coordinates object (3 levels deep!)

---

### Task 1.2: Product with Detailed Specifications

Insert a product with comprehensive nested specifications:

**Requirements**:
```javascript
{
  sku: "SMARTPHONE-IPHONE-15-PRO",
  name: "iPhone 15 Pro",
  category: "Electronics",
  subcategory: "Smartphones",
  price: 999.00,
  specifications: {
    display: {
      size: "6.1 inches",
      type: "OLED",
      resolution: "2556 x 1179"
    },
    processor: {
      model: "A17 Pro",
      cores: 6,
      gpu: "Apple GPU (6-core)"
    },
    memory: {
      ram: "8GB",
      storage: "256GB"
    },
    camera: {
      rear: {
        main: "48MP",
        ultrawide: "12MP",
        telephoto: "12MP"
      },
      front: "12MP"
    }
  },
  status: "active"
}
```

**Collection**: `products`

---

## Part 2: Querying Nested Fields

### Task 2.1: Query by City

Find all users who live in "San Francisco".

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({ "address.city": "San Francisco" })
```

Use dot notation with quotes!
</details>

---

### Task 2.2: Query by State

Find all users in California (state: "CA").

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({ "address.state": "CA" })
```
</details>

---

### Task 2.3: Query Deeply Nested Field

Find products with 6.1 inch display size.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({ "specifications.display.size": "6.1 inches" })
```

Dot notation works for any depth!
</details>

---

### Task 2.4: Query by RAM

Find products with "8GB" RAM.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({ "specifications.memory.ram": "8GB" })
```
</details>

---

### Task 2.5: Multiple Nested Conditions

Find products where:
- Display type is "OLED"
- Storage is "256GB"

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.find({
  "specifications.display.type": "OLED",
  "specifications.memory.storage": "256GB"
})
```
</details>

---

## Part 3: Updating Nested Fields

### Task 3.1: Update Address Field

Change Jessica's street address to "789 Pine Street".

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "jessica.taylor@example.com" },
  { $set: { "address.street": "789 Pine Street" } }
)
```
</details>

---

### Task 3.2: Update Multiple Nested Fields

Update Jessica's address:
- City: "Los Angeles"
- State: "CA"
- ZipCode: "90001"

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "jessica.taylor@example.com" },
  {
    $set: {
      "address.city": "Los Angeles",
      "address.state": "CA",
      "address.zipCode": "90001"
    }
  }
)
```
</details>

---

### Task 3.3: Update Deeply Nested Field

Update the iPhone's front camera to "15MP".

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "SMARTPHONE-IPHONE-15-PRO" },
  { $set: { "specifications.camera.front": "15MP" } }
)
```
</details>

---

### Task 3.4: Update Coordinates

Update Jessica's coordinates to:
- lat: 34.0522
- lng: -118.2437

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "jessica.taylor@example.com" },
  {
    $set: {
      "address.coordinates.lat": 34.0522,
      "address.coordinates.lng": -118.2437
    }
  }
)
```
</details>

---

## Part 4: Replacing vs Updating Nested Objects

### Task 4.1: Replace Entire Nested Object

Replace Jessica's entire address with a new one:

```javascript
{
  street: "321 Maple Drive",
  city: "Seattle",
  state: "WA",
  zipCode: "98101",
  country: "USA"
}
```

**Note**: This will remove coordinates!

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "jessica.taylor@example.com" },
  {
    $set: {
      address: {
        street: "321 Maple Drive",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        country: "USA"
      }
    }
  }
)
```

**Warning**: This replaces the entire address object!
Coordinates will be lost unless included.
</details>

---

### Task 4.2: Partial vs Complete Update

**Question**: What's the difference between these two approaches?

**Approach A** (Partial Update):
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { "address.city": "Boston" } }
)
```

**Approach B** (Complete Replacement):
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { address: { city: "Boston" } } }
)
```

<details>
<summary>💡 Answer</summary>

**Approach A**: Updates only the city field, keeps all other address fields intact.

**Approach B**: Replaces entire address object with just { city: "Boston" }.
All other fields (street, state, etc.) are removed!

**Best Practice**: Use dot notation for partial updates!
</details>

---

## Part 5: Adding New Nested Fields

### Task 5.1: Add New Specification

Add a new specification to iPhone:
- battery: "3200mAh"

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "SMARTPHONE-IPHONE-15-PRO" },
  { $set: { "specifications.battery": "3200mAh" } }
)
```

If the field doesn't exist, $set creates it!
</details>

---

### Task 5.2: Add Nested Object to Existing Document

Add shipping information to Jessica's address:

```javascript
shipping: {
  allowPOBox: false,
  requireSignature: true
}
```

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "jessica.taylor@example.com" },
  {
    $set: {
      "address.shipping": {
        allowPOBox: false,
        requireSignature: true
      }
    }
  }
)
```
</details>

---

## Part 6: Complex Embedded Scenarios

### Task 6.1: User with Payment Methods

Insert a user with multiple payment methods (embedded):

```javascript
{
  name: { first: "Robert", last: "Anderson" },
  email: "robert.anderson@example.com",
  paymentMethods: {
    creditCard: {
      last4: "1234",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025
    },
    paypal: {
      email: "robert.paypal@example.com",
      verified: true
    }
  },
  role: "customer",
  status: "active"
}
```

**Collection**: `users`

---

### Task 6.2: Query Payment Methods

Find users who have a verified PayPal account.

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.find({ "paymentMethods.paypal.verified": true })
```
</details>

---

### Task 6.3: Update Payment Method

Update Robert's credit card last 4 digits to "5678".

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "robert.anderson@example.com" },
  { $set: { "paymentMethods.creditCard.last4": "5678" } }
)
```
</details>

---

## Part 7: Embedded vs Referenced

### Scenario: User Orders

**Question**: Should orders be embedded in user documents or in a separate collection?

**Option A - Embedded**:
```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  orders: [
    { orderId: 1, date: "2024-01-15", total: 99.99 },
    { orderId: 2, date: "2024-01-20", total: 149.99 }
    // ... potentially hundreds of orders
  ]
}
```

**Option B - Referenced**:
```javascript
// users collection
{ _id: ObjectId("user123"), email: "user@example.com" }

// orders collection
{ _id: ObjectId("order456"), userId: ObjectId("user123"), total: 99.99 }
{ _id: ObjectId("order789"), userId: ObjectId("user123"), total: 149.99 }
```

<details>
<summary>💡 Answer</summary>

**Use Referenced (Option B)** because:
- ✅ Orders grow unbounded (hundreds per user)
- ✅ Orders are large documents
- ✅ Often query orders independently
- ✅ Document size limit (16MB)
- ✅ Update patterns differ

**Use Embedded when**:
- Small, fixed number of items
- Always accessed together
- Rarely updated independently
- Example: address, preferences, profile settings
</details>

---

## Part 8: Real-World Embedded Patterns

### Task 8.1: Product with Reviews Summary

Add a reviews summary (embedded) to a product:

```javascript
{
  sku: "LAPTOP-DELL-XPS13",
  // ... other fields ...
  reviewsSummary: {
    average: 4.5,
    count: 127,
    distribution: {
      "5star": 78,
      "4star": 32,
      "3star": 12,
      "2star": 3,
      "1star": 2
    },
    featured: [
      {
        author: "Jane D.",
        rating: 5,
        comment: "Best laptop ever!",
        helpful: 45
      }
    ]
  }
}
```

**Why embedded?**
- Summary is small and relatively static
- Always displayed with product
- Updated periodically, not real-time

---

### Task 8.2: User with Preferences

Add user preferences (embedded):

```javascript
{
  email: "user@example.com",
  preferences: {
    theme: "dark",
    language: "en",
    notifications: {
      email: true,
      sms: false,
      push: true,
      frequency: "daily"
    },
    privacy: {
      showEmail: false,
      showPhone: false,
      allowMarketingEmails: true
    }
  }
}
```

**Why embedded?**
- Small, fixed schema
- Always loaded with user
- User-specific settings

---

## Validation & Testing

### Verify Nested Queries

```javascript
// Test dot notation query
db.users.findOne({ "address.city": "San Francisco" })

// Test deeply nested
db.products.findOne({ "specifications.camera.rear.main": "48MP" })

// Test multiple nested conditions
db.users.find({
  "address.state": "CA",
  "address.coordinates.lat": { $gt: 30 }
})
```

### Verify Updates

```javascript
// After updating nested field
db.users.findOne(
  { email: "jessica.taylor@example.com" },
  { address: 1 }  // Project only address to see structure
)
```

---

## Common Mistakes to Avoid

❌ **Forgetting quotes** around dot notation: `address.city` → WRONG  
✅ **Correct**: `"address.city"`

❌ **Replacing instead of updating**: Using $set on entire object  
✅ **Correct**: Use dot notation for partial updates

❌ **Over-nesting**: Too many levels makes queries complex  
✅ **Best practice**: Usually 2-3 levels max

❌ **Embedding unbounded data**: Arrays that grow without limit  
✅ **Best practice**: Reference large or growing collections

❌ **Not planning for growth**: Embedding what should be referenced  
✅ **Think ahead**: Will this data grow? How will it be queried?

---

## Success Criteria

- [ ] Can create documents with nested objects
- [ ] Use dot notation correctly for queries
- [ ] Update nested fields without replacing entire objects
- [ ] Understand when to embed vs reference
- [ ] Query at multiple nesting levels
- [ ] Add new nested fields to existing documents

---

## Design Guidelines

### When to Embed

✅ **One-to-one** relationships  
✅ **One-to-few** relationships (< 100 items)  
✅ Data accessed together  
✅ Data doesn't change often  
✅ Need atomic updates  

**Examples**: Address, profile settings, preferences

### When to Reference

✅ **One-to-many** relationships (> 100 items)  
✅ **Many-to-many** relationships  
✅ Data queried independently  
✅ Large or growing data  
✅ Data shared across documents  

**Examples**: Orders, reviews, audit logs

---

## Additional Challenges (Optional)

### Challenge 1: Multi-Level Nesting

Create a product with shipping dimensions nested inside package info:

```javascript
{
  sku: "...",
  package: {
    dimensions: {
      length: { value: 10, unit: "cm" },
      width: { value: 5, unit: "cm" },
      height: { value: 2, unit: "cm" }
    },
    weight: { value: 250, unit: "g" }
  }
}
```

Then query products where length > 8 cm.

### Challenge 2: Conditional Nested Update

Update all products in "Electronics" category to add warranty info:

```javascript
warranty: {
  duration: 12,
  unit: "months",
  coverage: "manufacturer defect"
}
```

---

## Reflection Questions

1. When should you use embedded documents vs separate collections?
2. How does dot notation work in MongoDB?
3. What's the risk of replacing entire nested objects?
4. What's the maximum nesting level that's practical?
5. How do embedded documents affect document size limits?

---

## Next Steps

Once you've completed this exercise:
- ✅ Understand embedding patterns
- ✅ Master dot notation
- ✅ Know when to embed vs reference
- ✅ Move on to Exercise 07 - Array Operations

---

## Resources

- [MongoDB Embedded Documents](https://docs.mongodb.com/manual/tutorial/query-embedded-documents/)
- [Dot Notation](https://docs.mongodb.com/manual/core/document/#dot-notation)
- [Data Modeling Guide](https://docs.mongodb.com/manual/core/data-modeling-introduction/)
- [Schema Design Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary)

---

**Remember: Embedding is about data access patterns, not just relationships! 🎯**

