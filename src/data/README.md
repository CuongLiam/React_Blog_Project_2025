# Data Folder

This folder contains mock data for development and testing purposes.

## Files:

### `fakeData.ts`
Contains all mock data for the application:
- **users**: Mock user accounts with profile information
- **entries**: Categories for organizing articles (Personal Diary, Work Log, Thoughts, etc.)
- **articles**: Sample blog posts/diary entries with content, images, and metadata
- **comments**: User comments on articles
- **replies**: Replies to comments
- **likes**: Like/reaction data for articles

## Usage:
Import the data you need from `fakeData.ts`:
```typescript
import { users, entries, articles, comments, replies, likes } from './data/fakeData';
```

## Note:
In production, this data would be replaced with API calls to a backend server.
