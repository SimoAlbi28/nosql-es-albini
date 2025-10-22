# Lesson 04 - Your Solutions

This directory contains your solutions for Lesson 04 exercises.

## Topics Covered

- MongoDB Node.js driver integration
- TypeScript types for documents
- Type-safe CRUD operations
- Running aggregations from code
- Error handling
- Production best practices

## Exercises Checklist

### TypeScript Integration (01-05)
- [ ] 01 - Connection Setup
- [ ] 02 - Typed CRUD
- [ ] 03 - Aggregation Code
- [ ] 04 - Error Handling
- [ ] 05 - Full Integration

## TypeScript + MongoDB Patterns

### 1. Connection Setup

```typescript
import { MongoClient, Db } from 'mongodb';

class Database {
  private static client: MongoClient;
  private static db: Db;

  static async connect(uri: string, dbName: string): Promise<Db> {
    if (!this.db) {
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(dbName);
    }
    return this.db;
  }

  static async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
  }
}
```

### 2. Type Definitions

```typescript
import { ObjectId } from 'mongodb';

interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  createdAt: Date;
}

// For inserts (no _id yet)
type UserInsert = Omit<User, '_id'>;

// For updates (all fields optional)
type UserUpdate = Partial<Omit<User, '_id'>>;
```

### 3. Type-Safe CRUD

```typescript
import { Collection, Filter, UpdateFilter } from 'mongodb';

class UserRepository {
  constructor(private collection: Collection<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.collection.findOne({ email });
  }

  async create(user: UserInsert): Promise<User> {
    const result = await this.collection.insertOne({
      ...user,
      createdAt: new Date(),
    });
    return { ...user, _id: result.insertedId };
  }

  async update(id: ObjectId, update: UserUpdate): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: id } as Filter<User>,
      { $set: update } as UpdateFilter<User>
    );
    return result.modifiedCount > 0;
  }
}
```

### 4. Aggregation Pipelines

```typescript
interface OrderStats {
  _id: string;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
}

const getOrderStats = async (
  collection: Collection
): Promise<OrderStats[]> => {
  return collection
    .aggregate<OrderStats>([
      {
        $group: {
          _id: '$customerId',
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ])
    .toArray();
};
```

### 5. Error Handling

```typescript
import { MongoServerError } from 'mongodb';

try {
  await collection.insertOne(document);
} catch (error) {
  if (error instanceof MongoServerError) {
    if (error.code === 11000) {
      // Duplicate key error
      throw new Error('Document with this unique field already exists');
    }
  }
  throw error;
}
```

## Project Structure

```
lesson-04/
├── 01-connection-setup/
│   ├── src/
│   │   ├── database.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── 02-typed-crud/
│   ├── src/
│   │   ├── types/
│   │   ├── repositories/
│   │   └── index.ts
│   └── ...
└── ...
```

## Common TypeScript Issues

### Issue: Type Errors with MongoDB Types

```typescript
// ❌ Type error
const user = await collection.findOne({ _id: id });

// ✅ Correct: cast filter
const user = await collection.findOne({ _id: id } as Filter<User>);
```

### Issue: Optional _id

```typescript
// ✅ Make _id optional for types
interface User {
  _id?: ObjectId; // Optional because not present before insert
  email: string;
  name: string;
}
```

### Issue: Date Serialization

```typescript
// MongoDB stores dates as Date objects
interface Order {
  createdAt: Date; // Will be Date in DB, might be string in JSON
}

// When working with JSON:
const order: Order = {
  ...jsonData,
  createdAt: new Date(jsonData.createdAt), // Convert string to Date
};
```

## Testing Your Integration

```typescript
// Example test structure
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';

describe('User Repository', () => {
  before(async () => {
    // Setup: connect to test database
  });

  after(async () => {
    // Teardown: cleanup and close connection
  });

  it('should create a new user', async () => {
    const user = await userRepo.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    
    assert.ok(user._id);
    assert.strictEqual(user.email, 'test@example.com');
  });
});
```

## Best Practices

1. **Connection Management**
   - Use singleton pattern
   - Reuse connections
   - Close properly on shutdown

2. **Type Safety**
   - Define interfaces for all documents
   - Use strict TypeScript config
   - Avoid `any` types

3. **Error Handling**
   - Catch MongoDB-specific errors
   - Provide meaningful error messages
   - Log errors for debugging

4. **Performance**
   - Use projections
   - Create indexes
   - Batch operations when possible

5. **Security**
   - Validate input
   - Use environment variables
   - Never commit credentials

## Preparation for Competition

Your competition submission will be TypeScript code:
- Type-safe aggregation pipeline
- Proper error handling
- Performance optimizations
- Clean, readable code

## Resources

- [MongoDB Node.js Driver Docs](https://www.mongodb.com/docs/drivers/node/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- Course integration examples in main repository

## Need Help?

- Check integration-examples in course repo
- Review MongoDB driver documentation
- Test incrementally
- Ask questions via issues

