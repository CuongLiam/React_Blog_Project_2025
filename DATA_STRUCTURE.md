# Blog Application Data Structure

## Overview
This document explains how likes, comments, and replies are stored and managed in the application.

## Data Models

### 1. **User**
```typescript
interface user {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    avatar?: string;  // Optional profile picture
}
```

### 2. **Article**
```typescript
interface article {
    id: number;
    title: string;
    entryId: number;
    userId: number;      // Foreign key to user
    content: string;
    mood: string;
    status: string;      // "public" or "private"
    category: string;
    image: string;
    date: string;
}
```

### 3. **Like**
```typescript
interface like {
    id: number;
    articleId: number;   // Foreign key to article
    userId: number;      // Foreign key to user who liked
    createdAt: string;   // Timestamp
}
```
- **One article can have many likes**
- **One user can like multiple articles**
- To check if a user liked an article: `likes.filter(like => like.articleId === X && like.userId === Y)`

### 4. **Comment**
```typescript
interface comment {
    id: number;
    articleId: number;   // Foreign key to article
    userId: number;      // Foreign key to user who commented
    content: string;
    createdAt: string;   // Timestamp
    replies?: reply[];   // Optional array of replies (not stored, computed)
}
```
- **One article can have many comments**
- **One user can make multiple comments**
- To get all comments for an article: `comments.filter(c => c.articleId === X)`

### 5. **Reply**
```typescript
interface reply {
    id: number;
    commentId: number;   // Foreign key to comment
    userId: number;      // Foreign key to user who replied
    content: string;
    createdAt: string;   // Timestamp
}
```
- **One comment can have many replies**
- **One user can make multiple replies**
- To get all replies for a comment: `replies.filter(r => r.commentId === X)`

## Data Relationships

```
User (1) ----< (Many) Articles
User (1) ----< (Many) Likes
User (1) ----< (Many) Comments
User (1) ----< (Many) Replies

Article (1) ----< (Many) Likes
Article (1) ----< (Many) Comments

Comment (1) ----< (Many) Replies
```

## How It Works

### Likes System
1. When a user clicks the like button:
   - If already liked: Remove the like record from the likes array
   - If not liked: Add a new like record with `{articleId, userId, timestamp}`
2. Like count is calculated by: `likes.filter(like => like.articleId === articleId).length`
3. Check if current user liked: `likes.some(like => like.articleId === X && like.userId === currentUserId)`

### Comments System
1. When a user posts a comment:
   - Create a new comment object with `{articleId, userId, content, timestamp}`
   - Add it to the comments array
2. Display comments: `comments.filter(c => c.articleId === articleId)`
3. Each comment shows:
   - Author info (from users array)
   - Content
   - Timestamp
   - Number of replies

### Replies System
1. When a user replies to a comment:
   - Create a new reply object with `{commentId, userId, content, timestamp}`
   - Add it to the replies array
2. Display replies for a comment: `replies.filter(r => r.commentId === commentId)`
3. Replies are nested under their parent comment

## State Management (React)

In the Article Detail page, we use React state to manage real-time updates:

```typescript
const [currentLikes, setCurrentLikes] = useState(articleLikes);
const [currentComments, setCurrentComments] = useState(articleComments);
const [currentReplies, setCurrentReplies] = useState(replies);
```

This allows:
- ✅ Instant UI updates when liking/unliking
- ✅ Real-time comment additions
- ✅ Immediate reply additions
- ✅ No page refresh needed

## Routing

- **Home Page**: `/` - Shows all articles
- **Article Detail**: `/article/:id` - Shows single article with comments and likes
- **Sign In**: `/login`
- **Sign Up**: `/register`

## File Structure

```
src/
├── types/
│   └── user.ts              # Type definitions
├── data/
│   └── fakeData.ts          # Mock data (users, articles, likes, comments, replies)
├── pages/
│   ├── home/
│   │   ├── HomePage.tsx     # Article list with pagination and filtering
│   │   └── Article_detail.tsx # Article detail with comments system
│   └── auth/
│       ├── Signin.tsx
│       └── Signup.tsx
├── layouts/
│   └── user/
│       ├── Header.tsx
│       └── Footer.tsx
└── RouterConfig.tsx         # Route definitions
```

## Future Enhancements

When you add a backend (API), you would:
1. **Replace fake data** with API calls
2. **Store likes** in a database table
3. **Store comments** in a database table
4. **Store replies** in a database table
5. **Add authentication** to get the real current user
6. **Add real-time updates** with WebSockets (optional)

### Example API Structure:
```
POST   /api/articles/:id/like          # Toggle like
GET    /api/articles/:id/comments      # Get all comments
POST   /api/articles/:id/comments      # Add comment
POST   /api/comments/:id/replies       # Add reply
GET    /api/comments/:id/replies       # Get replies
```

## Notes

- Currently using **in-memory state** (data resets on page refresh)
- **CurrentUserId is hardcoded** (userId: 1) for demo purposes
- In production, you'd use:
  - Context API or Redux for global state
  - localStorage for persistence
  - Real backend API for permanent storage
