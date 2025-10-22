# Lesson 01 - Your Solutions

This directory contains your solutions for Lesson 01 exercises.

## Exercise Structure

For each exercise, create:
1. A GitHub issue (use exercise-planning template)
2. Your solution file (`.js` or `.mongodb` file)
3. Optional: Notes file (`.md`) with your observations

## Example Structure

```
lesson-01/
├── 01-insert-documents.mongodb    # Your MongoDB query
├── 01-insert-documents.md         # Your notes (optional)
├── 02-find-documents.mongodb
├── 02-find-documents.md
└── ...
```

## File Naming

Use the format: `XX-exercise-name.mongodb` or `XX-exercise-name.js`

- `XX` = exercise number (01, 02, etc.)
- Use kebab-case for file names
- `.mongodb` files can be executed directly in VS Code with MongoDB extension
- `.js` files for more complex solutions requiring Node.js

## Testing Your Solutions

### Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your Atlas cluster
3. Select the appropriate database
4. Copy your query from the solution file
5. Test in the query bar or aggregation pipeline builder

### Using mongosh (MongoDB Shell)
```bash
mongosh "your-connection-string"
use ecommerce
# Paste your query here
```

### Using VS Code MongoDB Extension
1. Install MongoDB for VS Code extension
2. Connect to your cluster
3. Open `.mongodb` file
4. Click "Execute" to run queries

## Exercises Checklist

- [ ] 01 - Insert Documents
- [ ] 02 - Find Documents
- [ ] 03 - Update Documents
- [ ] 04 - Delete Documents
- [ ] 05 - Query Basics
- [ ] 06 - Embedded Documents
- [ ] 07 - Array Operations
- [ ] 08 - Complex Updates
- [ ] 09 - Upsert Operations
- [ ] 10 - Recap Challenge

## Tips

1. **Create issue first**: Plan before implementing
2. **Test incrementally**: Test each part of your query
3. **Use comments**: Explain your approach
4. **Compare with expected**: Verify your results match requirements
5. **Document learnings**: Note any challenges or insights

## Need Help?

- Check course documentation in main repository
- Review examples in MongoDB docs
- Ask questions via GitHub issues
- Discuss with classmates (but write your own solutions!)

