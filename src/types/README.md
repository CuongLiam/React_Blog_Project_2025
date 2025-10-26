# Types Folder

This folder contains TypeScript type definitions and interfaces for the application.

## Files:

### `user.ts`
Contains all TypeScript interfaces used throughout the application:

#### User Related Types:
- **user**: User account information (id, name, email, password, avatar)

#### Category/Entry Related Types:
- **entry**: Category definitions for organizing articles

#### Article Related Types:
- **article**: Blog post/diary entry structure with all metadata

#### Social Interaction Types:
- **like**: Like/reaction data structure
- **comment**: Comment data with user and article relationships
- **reply**: Reply to comments with nested structure

## Usage:
Import the types you need:
```typescript
import type { user, article, entry, comment, like, reply } from '../types/user';
```

## Note:
These types ensure type safety across the entire application and should be updated whenever the data structure changes.
