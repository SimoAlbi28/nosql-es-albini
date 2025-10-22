# Exercise 03 - Update Documents

**Difficulty**: ⭐⭐ Beginner-Intermediate  
**Topics**: updateOne, updateMany, update operators ($set, $inc, $unset, $rename)  
**Estimated Time**: 30 minutes

---

## Learning Objectives

By completing this exercise, you will:
- ✅ Use `updateOne()` to modify a single document
- ✅ Use `updateMany()` to modify multiple documents
- ✅ Apply update operators ($set, $inc, $mul, $unset, $rename)
- ✅ Understand atomic updates
- ✅ Update nested fields and arrays

---

## Prerequisites

- Completed Exercises 01 and 02
- Documents exist in `users` and `products` collections
- MongoDB Compass connected

---

## Part 1: Basic Updates with $set

### Task 1.1: Update User Email

Update Emma Wilson's email to "emma.w@example.com".

**Collection**: `users`

**Steps**:
1. Filter: Find Emma by current email
2. Update: Set new email

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "emma.wilson@example.com" },
  { $set: { email: "emma.w@example.com" } }
)
```

**Result**:
```javascript
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1
}
```
</details>

---

### Task 1.2: Update Product Price

Update the Sony headphones price to $379.99 (sale price).

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "HDPHN-SONY-WH1000XM5" },
  { $set: { price: 379.99 } }
)
```
</details>

---

### Task 1.3: Update Multiple Fields

Update a user to add phone number and update status:
- User: michael.chen@example.com
- Phone: "+1-555-0150"
- Status: "inactive"

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "michael.chen@example.com" },
  {
    $set: {
      phone: "+1-555-0150",
      status: "inactive"
    }
  }
)
```

You can set multiple fields in one operation!
</details>

---

## Part 2: Update Multiple Documents

### Task 2.1: Update All Customer Status

Set all customers to have preferences.newsletter = true.

**Collection**: `users`

**Expected**: Multiple users updated (all with role "customer")

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateMany(
  { role: "customer" },
  { $set: { "preferences.newsletter": true } }
)
```

**Note**: Use dot notation for nested fields!
</details>

---

### Task 2.2: Update All Active Products

Add a field `lastUpdated` with current date to all active products.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateMany(
  { status: "active" },
  { $set: { lastUpdated: new Date() } }
)
```
</details>

---

### Task 2.3: Bulk Price Update

Increase all product prices in "Electronics" category by setting a new field `updated` to true.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateMany(
  { category: "Electronics" },
  { $set: { updated: true } }
)
```
</details>

---

## Part 3: Increment Operator ($inc)

### Task 3.1: Increment Product Quantity

If you have a `quantity` field, increment it by 10 for Dell XPS 13.

**Collection**: `products`

**Note**: If field doesn't exist, $inc creates it!

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "LAPTOP-DELL-XPS13" },
  { $inc: { quantity: 10 } }
)
```

`$inc` adds the specified value to the field.
</details>

---

### Task 3.2: Decrement Price

Decrease Sony headphones price by $20 using $inc.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "HDPHN-SONY-WH1000XM5" },
  { $inc: { price: -20 } }
)
```

Use negative number to decrement!
</details>

---

### Task 3.3: Track Login Count

Add a `loginCount` field to Emma's user and increment it.

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
// First update (creates field with value 1)
db.users.updateOne(
  { email: "emma.w@example.com" },
  { $inc: { loginCount: 1 } }
)

// Subsequent updates increment the value
db.users.updateOne(
  { email: "emma.w@example.com" },
  { $inc: { loginCount: 1 } }
)
```
</details>

---

## Part 4: Multiply Operator ($mul)

### Task 4.1: Apply 10% Discount

Multiply all product prices by 0.9 (10% discount).

**Collection**: `products`

**Warning**: This permanently changes prices!

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateMany(
  { status: "active" },
  { $mul: { price: 0.9 } }
)
```

`$mul` multiplies the field value.
</details>

---

## Part 5: Remove Fields ($unset)

### Task 5.1: Remove Temporary Field

Remove the `updated` field from all products.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateMany(
  {},
  { $unset: { updated: "" } }
)
```

The value doesn't matter for `$unset`, it just removes the field.
</details>

---

### Task 5.2: Remove User's Phone

Remove phone number from a specific user.

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "michael.chen@example.com" },
  { $unset: { phone: "" } }
)
```
</details>

---

## Part 6: Rename Fields ($rename)

### Task 6.1: Rename Field

Rename the `loginCount` field to `totalLogins` for all users who have it.

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateMany(
  { loginCount: { $exists: true } },
  { $rename: { loginCount: "totalLogins" } }
)
```
</details>

---

## Part 7: Update Nested Fields

### Task 7.1: Update Nested Address

Update Emma's city to "Boston".

**Collection**: `users`

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "emma.w@example.com" },
  { $set: { "address.city": "Boston" } }
)
```

Use dot notation for nested fields!
</details>

---

### Task 7.2: Update Product Specifications

Update Sony headphones to add a new specification: `weight: "250g"`.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "HDPHN-SONY-WH1000XM5" },
  { $set: { "specifications.weight": "250g" } }
)
```
</details>

---

## Part 8: Current Date Operator

### Task 8.1: Set Last Modified Date

Add/update `updatedAt` field with current timestamp for a product.

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "LAPTOP-DELL-XPS13" },
  { $currentDate: { updatedAt: true } }
)

// Or specify type
db.products.updateOne(
  { sku: "LAPTOP-DELL-XPS13" },
  { $currentDate: { updatedAt: { $type: "date" } } }
)
```
</details>

---

## Part 9: Combining Multiple Operators

### Task 9.1: Complex Update

For Sony headphones, do ALL of the following in ONE update:
- Increase price by $10 ($inc)
- Set status to "active" ($set)
- Set updatedAt to current date ($currentDate)

**Collection**: `products`

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateOne(
  { sku: "HDPHN-SONY-WH1000XM5" },
  {
    $inc: { price: 10 },
    $set: { status: "active" },
    $currentDate: { updatedAt: true }
  }
)
```

You can combine multiple update operators!
</details>

---

## Validation & Testing

### Verify Your Updates

After each update, verify the changes:

```javascript
// Check the update worked
db.users.findOne({ email: "emma.w@example.com" })

// Check multiple documents were updated
db.products.countDocuments({ updated: true })

// Verify field was removed
db.products.findOne({ sku: "...", updated: { $exists: false } })
```

### Check Update Results

Every update operation returns a result:

```javascript
{
  acknowledged: true,
  matchedCount: 1,    // How many matched the filter
  modifiedCount: 1    // How many were actually modified
}
```

**Note**: `modifiedCount` might be 0 if the document already had those values!

---

## Common Mistakes to Avoid

❌ **Not using $set**: `updateOne({filter}, {field: value})` → WRONG  
✅ **Correct**: `updateOne({filter}, {$set: {field: value}})`

❌ **Using updateOne for bulk updates**: Use updateMany instead

❌ **Forgetting dot notation** for nested fields: Use `"address.city"` not `address.city`

❌ **Mixing update and replace**: replaceOne() replaces entire document, update() modifies fields

❌ **Not checking matchedCount**: Make sure filter actually matched documents

---

## Success Criteria

- [ ] Can update a single document with updateOne()
- [ ] Can update multiple documents with updateMany()
- [ ] Understand and use $set operator
- [ ] Can use $inc to increment/decrement numbers
- [ ] Can use $mul for multiplication
- [ ] Can remove fields with $unset
- [ ] Can rename fields with $rename
- [ ] Can update nested fields with dot notation
- [ ] Can combine multiple update operators
- [ ] Understand update operation results (matchedCount, modifiedCount)

---

## Additional Challenges (Optional)

### Challenge 1: Conditional Update

Update only products with price > $100 to add a "premium" tag.

**Hint**: You'll need array operators (preview of next exercise!).

<details>
<summary>💡 Solution</summary>

```javascript
db.products.updateMany(
  { price: { $gt: 100 } },
  { $addToSet: { tags: "premium" } }
)
```

`$addToSet` adds to array only if value doesn't exist.
</details>

### Challenge 2: Set on Insert

Use `upsert` option to update if exists, insert if doesn't.

```javascript
db.users.updateOne(
  { email: "new.user@example.com" },
  {
    $set: { name: "New User", status: "active" },
    $setOnInsert: { createdAt: new Date() }
  },
  { upsert: true }
)
```

`$setOnInsert` only sets field if document is being inserted (not updated).

---

## Reflection Questions

1. What's the difference between updateOne() and updateMany()?
2. Why must you use update operators like $set instead of just passing an object?
3. What happens if you update a field that doesn't exist?
4. When would you use $inc vs $set for numeric fields?
5. What's the difference between modifiedCount and matchedCount?

---

## Next Steps

Once you've completed this exercise:
- ✅ Verify all updates in Compass
- ✅ Check the documents look as expected
- ✅ Document learnings in GitHub issue
- ✅ Move on to Exercise 04 - Delete Documents

---

## Resources

- [MongoDB updateOne() Documentation](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/)
- [MongoDB updateMany() Documentation](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/)
- [Update Operators Reference](https://docs.mongodb.com/manual/reference/operator/update/)
- [Dot Notation](https://docs.mongodb.com/manual/core/document/#dot-notation)

---

**Pro Tip: Updates are atomic at the document level - perfect for concurrent operations! ⚡**

