# Exercise 01 - Insert Documents

**Difficulty**: ⭐ Beginner  
**Topics**: insertOne, insertMany, document structure  
**Estimated Time**: 20 minutes

---

## Learning Objectives

By completing this exercise, you will:
- ✅ Use `insertOne()` to add a single document
- ✅ Use `insertMany()` to add multiple documents
- ✅ Understand `_id` field and ObjectId
- ✅ Work with different data types (strings, numbers, dates, objects, arrays)

---

## Prerequisites

- MongoDB Atlas cluster set up
- MongoDB Compass connected
- `ecommerce` database created

---

## Part 1: Insert Single Documents

### Task 1.1: Insert a User

Insert a new user into the `users` collection with the following information:

**Requirements**:
- "First name": "Emma"
- "Last name": "Wilson"
- "Email": "emma.wilson@example.com"
- "Phone": "+1-555-0199"
- "Role": "customer"
- "Status": "active"
- "Created date": Current date/time

**Collection**: `users`

**Expected Result**:
```json
{
  "acknowledged": true,
  "insertedId": ObjectId("...")
}
```

<details>
<summary>💡 Hint</summary>

Use `insertOne()` method:
```javascript
db.users.insertOne({
  // your fields here
})
```

For current date: `new Date()` or `ISODate()`
</details>

---

### Task 1.2: Insert a Product

Insert a new product into the `products` collection:

**Requirements**:
- SKU: "HDPHN-SONY-WH1000XM5"
- Name: "Sony WH-1000XM5 Wireless Headphones"
- Description: "Industry-leading noise cancellation with premium sound quality"
- Category: "Electronics"
- Subcategory: "Headphones"
- Brand: "Sony"
- Price: 399.99
- Currency: "USD"
- Tags: ["wireless", "noise-cancelling", "premium", "bluetooth"]
- Status: "active"
- Featured: true
- Specifications:
  - type: "Over-ear"
  - connectivity: "Bluetooth 5.2"
  - batteryLife: "30 hours"
  - noiseCancellation: true

**Collection**: `products`

<details>
<summary>💡 Hint</summary>

Use nested objects for specifications:
```javascript
{
  specifications: {
    type: "Over-ear",
    connectivity: "Bluetooth 5.2"
  }
}
```

Tags are an array: `["tag1", "tag2"]`
</details>

---

## Part 2: Insert Multiple Documents

### Task 2.1: Insert Multiple Users

Insert THREE users at once using `insertMany()`:

**User 1**:
- Name: "Michael Chen"
- Email: "michael.chen@example.com"
- Role: "customer"
- Status: "active"

**User 2**:
- Name: "Sarah Johnson"
- Email: "sarah.johnson@example.com"
- Role: "customer"
- Status: "active"

**User 3**:
- Name: "David Martinez"
- Email: "david.martinez@example.com"
- Role: "admin"
- Status: "active"

**Collection**: `users`

<details>
<summary>💡 Hint</summary>

```javascript
db.users.insertMany([
  { /* user 1 */ },
  { /* user 2 */ },
  { /* user 3 */ }
])
```
</details>

---

### Task 2.2: Insert Multiple Products

Insert TWO products at once:

**Product 1 - Laptop**:
- SKU: "LAPTOP-DELL-XPS13"
- Name: "Dell XPS 13"
- Category: "Electronics"
- Subcategory: "Laptops"
- Price: 1299.99
- Status: "active"
- Tags: ["laptop", "ultrabook", "dell"]

**Product 2 - Mouse**:
- SKU: "MOUSE-LOGITECH-MX3"
- Name: "Logitech MX Master 3"
- Category: "Electronics"
- Subcategory: "Accessories"
- Price: 99.99
- Status: "active"
- Tags: ["mouse", "wireless", "ergonomic"]

**Collection**: `products`

---

## Part 3: Understanding _id Field

### Task 3.1: Insert with Custom _id

Insert a user with a custom `_id`:

**Requirements**:
- _id: "user_custom_001"
- Name: "Test User"
- Email: "test.user@example.com"
- Role: "customer"

**Question**: What happens if you try to insert another document with the same `_id`?

<details>
<summary>💡 Answer</summary>

MongoDB will throw a duplicate key error:
```
E11000 duplicate key error collection: ecommerce.users index: _id_
```

The `_id` field must be unique within a collection.
</details>

---

### Task 3.2: Let MongoDB Generate _id

Insert a user WITHOUT specifying `_id`:

**Requirements**:
- Name: "Auto ID User"
- Email: "auto.id@example.com"

**Observe**: MongoDB automatically generates an ObjectId for `_id`.

**Question**: What is the structure of ObjectId?

<details>
<summary>💡 Answer</summary>

ObjectId is a 12-byte identifier:
- 4 bytes: timestamp (creation time)
- 5 bytes: random value
- 3 bytes: incrementing counter

Example: `ObjectId("65a7f1e4b8c9d1234567890a")`

This ensures uniqueness across distributed systems.
</details>

---

## Part 4: Data Types

### Task 4.1: Insert Document with Various Types

Insert a product demonstrating different BSON data types:

**Requirements**:
- SKU: "TEST-TYPES-001" (String)
- Name: "Data Types Demo Product" (String)
- Price: 99.99 (Number - Double)
- Quantity: 100 (Number - Integer)
- InStock: true (Boolean)
- Tags: ["demo", "test"] (Array)
- Dimensions: (Object)
  - length: 10.5
  - width: 5.25
  - height: 2.0
- ReleaseDate: January 15, 2024 (Date)
- Metadata: null (Null)

**Collection**: `products`

---

## Validation & Testing

### Verify Your Inserts

After completing all tasks, verify your documents:

```javascript
// Count users
db.users.countDocuments()
// Should be at least 6

// Count products
db.products.countDocuments()
// Should be at least 5

// Find all users
db.users.find()

// Find all products
db.products.find()
```

### Check Specific Documents

```javascript
// Find Emma Wilson
db.users.findOne({ email: "emma.wilson@example.com" })

// Find Sony headphones
db.products.findOne({ sku: "HDPHN-SONY-WH1000XM5" })
```

---

## Common Mistakes to Avoid

❌ **Missing required fields**: Some applications require certain fields
❌ **Wrong data types**: Using string "100" instead of number 100
❌ **Forgetting commas**: JSON syntax requires commas between fields
❌ **Duplicate _id**: Will cause insertion to fail
❌ **Special characters in unquoted strings**: Always quote strings

---

## Success Criteria

- [ ] Successfully inserted at least 6 users
- [ ] Successfully inserted at least 5 products
- [ ] Understood difference between insertOne() and insertMany()
- [ ] Understood role of _id field
- [ ] Used various data types correctly (string, number, boolean, date, object, array)
- [ ] All documents can be queried and found in collections

---

## Additional Challenges (Optional)

### Challenge 1: Bulk Insert

Insert 10 users at once with a single command. Use a pattern for email addresses:
- user1@example.com
- user2@example.com
- etc.

<details>
<summary>💡 Hint</summary>

You can manually create the array or use a loop in mongosh or your application code.
</details>

### Challenge 2: Nested Arrays

Insert a product with an array of related products (references):

```javascript
{
  sku: "COMBO-OFFICE-KIT",
  name: "Office Starter Kit",
  relatedProducts: [
    ObjectId("..."), // Mouse
    ObjectId("..."), // Keyboard
    ObjectId("...")  // Monitor
  ]
}
```

---

## Reflection Questions

1. When would you use `insertOne()` vs `insertMany()`?
2. Why is the `_id` field important?
3. What happens if insertMany() fails in the middle of inserting multiple documents?
4. How does MongoDB handle different data types compared to SQL?

---

## Next Steps

Once you've completed this exercise:
- ✅ Create a GitHub issue documenting what you learned
- ✅ Commit your solution (query text or screenshots)
- ✅ Move on to Exercise 02 - Find Documents

---

## Resources

- [MongoDB insertOne() Documentation](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/)
- [MongoDB insertMany() Documentation](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/)
- [BSON Data Types](https://docs.mongodb.com/manual/reference/bson-types/)
- [ObjectId Specification](https://docs.mongodb.com/manual/reference/method/ObjectId/)

---

**Good luck! Remember: Create a GitHub issue first, then implement! 🚀**

