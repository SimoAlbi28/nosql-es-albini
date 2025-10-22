# Exercise 10 - Comprehensive Challenge

**Difficulty**: ⭐⭐⭐ Advanced  
**Topics**: All CRUD operations, real-world scenario, end-to-end implementation  
**Estimated Time**: 60-90 minutes

---

## Challenge Overview

Build a **complete e-commerce order management system** using everything you've learned in Exercises 01-09.

This challenge simulates real-world operations you'd perform in a production application.

---

## Learning Objectives

By completing this challenge, you will:
- ✅ Apply all CRUD operations in realistic scenarios
- ✅ Work with complex documents and relationships
- ✅ Handle edge cases and error scenarios
- ✅ Build a complete workflow from start to finish
- ✅ Demonstrate mastery of MongoDB fundamentals

---

## Scenario: E-commerce Order System

You're building the backend for an e-commerce platform. Implement the following workflow:

1. Customer registration
2. Product browsing
3. Shopping cart management
4. Order placement
5. Order tracking
6. Product reviews

---

## Part 1: Customer Registration (20 minutes)

### Task 1.1: Register New Customer

Create a new customer account with validation:

**Requirements**:
- Email must be unique
- Set default preferences
- Track registration date
- Initialize empty cart and wishlist

```javascript
// Implement this operation
{
  name: { first: "Emily", last: "Rodriguez" },
  email: "emily.rodriguez@example.com",
  password: "$2b$10$...",  // Hashed
  phone: "+1-555-0177",
  address: {
    street: "789 Elm Street",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    country: "USA"
  },
  preferences: {
    newsletter: true,
    notifications: true,
    currency: "USD",
    language: "en"
  },
  cart: [],
  wishlist: [],
  role: "customer",
  status: "active",
  createdAt: new Date()
}
```

<details>
<summary>💡 Hint</summary>

Use `insertOne()` and create a unique index on email:
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
```
</details>

---

### Task 1.2: Handle Duplicate Registration

Try to register the same email again. Handle the error gracefully.

<details>
<summary>💡 Solution Approach</summary>

```javascript
try {
  db.users.insertOne({...})
} catch (error) {
  if (error.code === 11000) {
    console.log("Email already exists")
    // In real app: return error to user
  }
}
```

Or use upsert with proper logic.
</details>

---

## Part 2: Product Catalog (15 minutes)

### Task 2.1: Add Products to Catalog

Insert the following products:

**Product 1 - Laptop**:
```javascript
{
  sku: "LAP-MBP-16-M3-2024",
  name: "MacBook Pro 16-inch M3",
  category: "Electronics",
  subcategory: "Laptops",
  brand: "Apple",
  price: 2499.00,
  compareAtPrice: 2999.00,
  currency: "USD",
  tags: ["laptop", "premium", "sale", "apple"],
  specifications: {
    processor: "Apple M3 Pro",
    ram: "18GB",
    storage: "512GB SSD",
    display: "16-inch Liquid Retina XDR"
  },
  images: ["url1.jpg", "url2.jpg"],
  stock: 25,
  status: "active",
  featured: true,
  rating: { average: 0, count: 0 },
  createdAt: new Date()
}
```

**Product 2 - Headphones**:
```javascript
{
  sku: "AUD-APL-AIRPODS-MAX",
  name: "AirPods Max",
  category: "Electronics",
  subcategory: "Audio",
  brand: "Apple",
  price: 549.00,
  tags: ["headphones", "wireless", "premium"],
  specifications: {
    type: "Over-ear",
    connectivity: "Bluetooth 5.0",
    noiseCancellation: true
  },
  stock: 50,
  status: "active",
  rating: { average: 0, count: 0 },
  createdAt: new Date()
}
```

**Product 3 - Mouse**:
```javascript
{
  sku: "ACC-LOG-MX-MASTER-3",
  name: "Logitech MX Master 3",
  category: "Electronics",
  subcategory: "Accessories",
  brand: "Logitech",
  price: 99.99,
  tags: ["mouse", "wireless", "ergonomic"],
  stock: 100,
  status: "active",
  rating: { average: 0, count: 0 },
  createdAt: new Date()
}
```

---

### Task 2.2: Query Products

Implement these product searches:

1. Find all products in "Electronics" category
2. Find products with price between $100 and $1000
3. Find products tagged "wireless"
4. Find featured products sorted by price (high to low)
5. Count total active products

<details>
<summary>💡 Solutions</summary>

```javascript
// 1
db.products.find({ category: "Electronics" })

// 2
db.products.find({ price: { $gte: 100, $lte: 1000 } })

// 3
db.products.find({ tags: "wireless" })

// 4
db.products.find({ featured: true }).sort({ price: -1 })

// 5
db.products.countDocuments({ status: "active" })
```
</details>

---

## Part 3: Shopping Cart (20 minutes)

### Task 3.1: Add Product to Cart

Emily adds MacBook to her cart:

**Requirements**:
- Add product to cart array
- Store: productId, SKU, name, price, quantity
- If product already in cart, increment quantity
- Update cart total

<details>
<summary>💡 Hint</summary>

Check if product exists in cart first:
```javascript
const user = db.users.findOne({
  email: "emily.rodriguez@example.com",
  "cart.sku": "LAP-MBP-16-M3-2024"
})

if (user) {
  // Increment quantity
} else {
  // Add new item
}
```
</details>

<details>
<summary>💡 Full Solution</summary>

```javascript
// Check if exists
const user = db.users.findOne({
  email: "emily.rodriguez@example.com",
  "cart.sku": "LAP-MBP-16-M3-2024"
})

if (user) {
  // Increment quantity
  db.users.updateOne(
    {
      email: "emily.rodriguez@example.com",
      "cart.sku": "LAP-MBP-16-M3-2024"
    },
    {
      $inc: { "cart.$.quantity": 1 }
    }
  )
} else {
  // Add new item
  const product = db.products.findOne({ sku: "LAP-MBP-16-M3-2024" })
  
  db.users.updateOne(
    { email: "emily.rodriguez@example.com" },
    {
      $push: {
        cart: {
          productId: product._id,
          sku: product.sku,
          name: product.name,
          price: product.price,
          quantity: 1,
          addedAt: new Date()
        }
      }
    }
  )
}
```
</details>

---

### Task 3.2: Add More Products

Emily adds:
- AirPods Max (quantity: 1)
- Logitech Mouse (quantity: 2)

---

### Task 3.3: Update Cart Quantity

Emily changes mouse quantity from 2 to 3.

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  {
    email: "emily.rodriguez@example.com",
    "cart.sku": "ACC-LOG-MX-MASTER-3"
  },
  {
    $set: { "cart.$.quantity": 3 }
  }
)
```
</details>

---

### Task 3.4: Remove from Cart

Emily removes AirPods from cart.

<details>
<summary>💡 Solution</summary>

```javascript
db.users.updateOne(
  { email: "emily.rodriguez@example.com" },
  {
    $pull: {
      cart: { sku: "AUD-APL-AIRPODS-MAX" }
    }
  }
)
```
</details>

---

## Part 4: Order Placement (25 minutes)

### Task 4.1: Create Order

Emily places an order with items from her cart.

**Requirements**:
- Generate unique order number
- Copy items from cart
- Calculate totals (subtotal, tax, shipping, total)
- Store shipping address
- Set order status to "pending"
- Clear user's cart
- Decrement product stock

```javascript
{
  orderNumber: "ORD-2024-" + Date.now(),
  userId: ObjectId("..."),
  customerInfo: {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    phone: "+1-555-0177"
  },
  items: [
    // Copy from cart
  ],
  shippingAddress: {
    // Copy from user.address
  },
  subtotal: 2798.97,  // Calculate
  tax: 251.91,        // 9% tax
  shippingCost: 0.00,
  discount: 0.00,
  total: 3050.88,
  currency: "USD",
  status: "pending",
  paymentStatus: "pending",
  createdAt: new Date()
}
```

<details>
<summary>💡 Solution Approach</summary>

```javascript
// 1. Get user and cart
const user = db.users.findOne({ email: "emily.rodriguez@example.com" })

// 2. Calculate totals
let subtotal = 0
user.cart.forEach(item => {
  subtotal += item.price * item.quantity
})
const tax = subtotal * 0.09
const total = subtotal + tax

// 3. Create order
db.orders.insertOne({
  orderNumber: "ORD-2024-" + Date.now(),
  userId: user._id,
  customerInfo: {
    name: user.name.first + " " + user.name.last,
    email: user.email,
    phone: user.phone
  },
  items: user.cart,
  shippingAddress: user.address,
  subtotal: subtotal,
  tax: tax,
  shippingCost: 0,
  discount: 0,
  total: total,
  currency: "USD",
  status: "pending",
  paymentStatus: "pending",
  createdAt: new Date()
})

// 4. Clear cart
db.users.updateOne(
  { _id: user._id },
  { $set: { cart: [] } }
)

// 5. Decrement stock
user.cart.forEach(item => {
  db.products.updateOne(
    { sku: item.sku },
    { $inc: { stock: -item.quantity } }
  )
})
```
</details>

---

### Task 4.2: Update Order Status

**Workflow**:
1. Order is paid → status: "processing", paymentStatus: "paid"
2. Order is shipped → status: "shipped", add trackingNumber
3. Order is delivered → status: "delivered", add deliveredAt

<details>
<summary>💡 Solutions</summary>

```javascript
// Payment confirmed
db.orders.updateOne(
  { orderNumber: "ORD-2024-..." },
  {
    $set: {
      status: "processing",
      paymentStatus: "paid",
      paidAt: new Date()
    }
  }
)

// Shipped
db.orders.updateOne(
  { orderNumber: "ORD-2024-..." },
  {
    $set: {
      status: "shipped",
      trackingNumber: "1Z999AA10123456784",
      shippedAt: new Date()
    }
  }
)

// Delivered
db.orders.updateOne(
  { orderNumber: "ORD-2024-..." },
  {
    $set: {
      status: "delivered",
      deliveredAt: new Date()
    }
  }
)
```
</details>

---

## Part 5: Product Reviews (15 minutes)

### Task 5.1: Add Product Review

Emily reviews the MacBook:

```javascript
{
  productId: ObjectId("..."),
  userId: ObjectId("..."),
  userName: "Emily R.",
  rating: 5,
  title: "Amazing laptop!",
  comment: "Best laptop I've ever owned. The M3 chip is incredibly fast!",
  verified: true,  // Verified purchase
  helpful: 0,
  images: [],
  status: "approved",
  createdAt: new Date()
}
```

**Collection**: `reviews`

---

### Task 5.2: Update Product Rating

After review is added, update product's rating:

**Requirements**:
- Increment rating.count
- Recalculate rating.average

<details>
<summary>💡 Solution</summary>

```javascript
// Insert review
db.reviews.insertOne({...})

// Get all reviews for product
const reviews = db.reviews.find({
  productId: ObjectId("..."),
  status: "approved"
}).toArray()

// Calculate average
const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
const avgRating = totalRating / reviews.length

// Update product
db.products.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      "rating.average": avgRating,
      "rating.count": reviews.length
    }
  }
)
```
</details>

---

## Part 6: Analytics Queries (15 minutes)

### Task 6.1: Customer Analytics

Find the following:

1. Total number of customers
2. Active customers
3. Customers with items in cart
4. Customers who made purchases (have orders)

<details>
<summary>💡 Solutions</summary>

```javascript
// 1
db.users.countDocuments({ role: "customer" })

// 2
db.users.countDocuments({ role: "customer", status: "active" })

// 3
db.users.countDocuments({
  role: "customer",
  cart: { $exists: true, $ne: [] }
})

// 4
const customersWithOrders = db.orders.distinct("userId")
customersWithOrders.length
```
</details>

---

### Task 6.2: Product Analytics

Find:

1. Most expensive product
2. Products low in stock (< 10 units)
3. Products with 5-star average rating
4. Total value of inventory

<details>
<summary>💡 Solutions</summary>

```javascript
// 1
db.products.find().sort({ price: -1 }).limit(1)

// 2
db.products.find({ stock: { $lt: 10 } })

// 3
db.products.find({ "rating.average": 5 })

// 4 (using aggregation - preview!)
db.products.aggregate([
  {
    $group: {
      _id: null,
      totalValue: { $sum: { $multiply: ["$price", "$stock"] } }
    }
  }
])
```
</details>

---

### Task 6.3: Order Analytics

Find:

1. Total number of orders
2. Orders with status "delivered"
3. Total revenue (sum of all order totals)
4. Emily's order history

<details>
<summary>💡 Solutions</summary>

```javascript
// 1
db.orders.countDocuments()

// 2
db.orders.countDocuments({ status: "delivered" })

// 3 (aggregation)
db.orders.aggregate([
  { $match: { paymentStatus: "paid" } },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$total" }
    }
  }
])

// 4
const user = db.users.findOne({ email: "emily.rodriguez@example.com" })
db.orders.find({ userId: user._id }).sort({ createdAt: -1 })
```
</details>

---

## Part 7: Edge Cases and Error Handling

### Task 7.1: Handle Out of Stock

Try to add 100 units of a product that only has 25 in stock.

**Solution approach**:
- Check stock before adding to cart
- If insufficient, show error

---

### Task 7.2: Handle Invalid Product

Try to add a product that doesn't exist.

---

### Task 7.3: Prevent Negative Stock

Ensure stock never goes negative when placing orders.

<details>
<summary>💡 Solution</summary>

```javascript
// Use conditional update
db.products.updateOne(
  {
    sku: "...",
    stock: { $gte: quantity }  // Only if enough stock
  },
  {
    $inc: { stock: -quantity }
  }
)

// Check if update succeeded
if (result.modifiedCount === 0) {
  throw new Error("Insufficient stock")
}
```
</details>

---

## Part 8: Bonus Challenges (Optional)

### Challenge 1: Wishlist Management

Implement add/remove from wishlist:

```javascript
// Add to wishlist
db.users.updateOne(
  { email: "emily.rodriguez@example.com" },
  { $addToSet: { wishlist: ObjectId("product_id") } }
)

// Remove from wishlist
db.users.updateOne(
  { email: "emily.rodriguez@example.com" },
  { $pull: { wishlist: ObjectId("product_id") } }
)
```

---

### Challenge 2: Order Cancellation

Implement order cancellation:
- Update order status to "cancelled"
- Restore product stock
- Maybe issue refund

---

### Challenge 3: Product Search

Implement full-text search:

```javascript
// Create text index
db.products.createIndex({ name: "text", description: "text" })

// Search
db.products.find({ $text: { $search: "laptop apple" } })
```

---

## Success Criteria

- [ ] Customer registration with validation
- [ ] Product catalog with queries
- [ ] Shopping cart add/update/remove
- [ ] Order placement workflow
- [ ] Order status updates
- [ ] Product reviews
- [ ] Rating calculations
- [ ] Analytics queries
- [ ] Edge case handling
- [ ] All operations tested and working

---

## Validation Checklist

Before considering complete:

```javascript
// 1. Verify user exists
db.users.findOne({ email: "emily.rodriguez@example.com" })

// 2. Verify products exist
db.products.find({ sku: { $in: ["LAP-MBP-16-M3-2024", "ACC-LOG-MX-MASTER-3"] } })

// 3. Verify order created
db.orders.findOne({ "customerInfo.email": "emily.rodriguez@example.com" })

// 4. Verify cart cleared
// user.cart should be []

// 5. Verify stock updated
// products should have reduced stock

// 6. Verify review exists
db.reviews.findOne({ userName: "Emily R." })

// 7. Verify rating updated
// product should have updated rating
```

---

## Reflection Questions

1. What was the most challenging part?
2. How did you handle the relationship between users, products, and orders?
3. What would you do differently in a production system?
4. What additional features would improve this system?
5. How would you handle concurrent orders for limited stock?

---

## Next Steps

Congratulations! You've completed **ALL 10 exercises** of Lesson 01! 🎉

You now have:
- ✅ Strong CRUD fundamentals
- ✅ Understanding of document modeling
- ✅ Experience with arrays and embedded documents
- ✅ Knowledge of update patterns
- ✅ Real-world implementation experience

**Ready for Lesson 02**: Advanced queries, aggregations, and more! 🚀

---

## What You've Learned

### CRUD Operations
- Insert: insertOne, insertMany
- Read: find, findOne, queries, operators
- Update: updateOne, updateMany, operators
- Delete: deleteOne, deleteMany, soft delete

### Advanced Topics
- Embedded documents
- Arrays and array operators
- Complex updates
- Upserts
- Atomic operations
- Real-world patterns

### Best Practices
- Data modeling
- Index usage
- Error handling
- Performance considerations
- Production patterns

---

**Amazing work! Take a well-deserved break, then continue to Lesson 02! 🌟**

