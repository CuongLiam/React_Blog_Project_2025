# Admin Articles Management - Documentation

## Overview
The `Admin_articles.tsx` component is a comprehensive article management interface for administrators. It provides full CRUD (Create, Read, Update, Delete) operations with **role-based access control** to ensure proper authorization for editing and deleting articles.

---

## Features

### 1. **Article Listing**
- Displays all articles in a paginated table format
- Shows article image, title, category, content preview, status, and author role
- Pagination with 5 articles per page
- Loading, error, and empty states with Font Awesome icons

### 2. **Role-Based Access Control (RBAC)**
The component implements strict permission rules based on user roles:

| User Role | Can Edit/Delete |
|-----------|----------------|
| **MASTER** | ✅ MASTER articles<br>✅ ADMIN articles<br>❌ USER articles |
| **ADMIN** | ✅ ADMIN articles<br>❌ MASTER articles<br>❌ USER articles |
| **USER** | ❌ Cannot access admin panel |

**Key Points:**
- Admins and Masters **cannot edit or delete regular user articles**
- Admins can only modify articles created by other admins
- Masters have higher privileges and can modify both master and admin articles
- Visual indicators (disabled buttons) show which articles cannot be edited

### 3. **Status Management**
- Quick status toggle between "public" (Công khai) and "private" (Riêng tư)
- Inline dropdown for instant status changes
- Changes are immediately saved to the backend

### 4. **Article Operations**

#### **Add New Article**
- Button links to `/admin/add-articles` page
- Located at the top-left of the page

#### **Edit Article**
- Opens an Ant Design modal with title and content fields
- Validates that fields are not empty
- Shows error message if user lacks permission
- Disabled button with gray styling for unauthorized articles

#### **Delete Article**
- Opens a confirmation modal before deletion
- Shows warning that action cannot be undone
- Shows error message if user lacks permission
- Disabled button with gray styling for unauthorized articles

---

## Technical Architecture

### **Dependencies**
```typescript
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Modal, message } from "antd";
import axios from "axios";
import AdminHeader from "../../layouts/admin/Header";
import Sidebar_menu from "../../layouts/admin/Sidebar_menu";
import { fetchArticles } from "../../store/slices/articleSlice";
import { fetchUsers } from "../../store/slices/userSlice";
import type { AppDispatch } from "../../store";
```

### **Redux State**
- **articles**: Array of all articles from `articleSlice`
- **users**: Array of all users from `userSlice`
- **loading**: Boolean indicating data fetch status
- **error**: Error message if fetch fails

### **Local State**
```typescript
const [currentPage, setCurrentPage] = useState(1);
const [statusEdits, setStatusEdits] = useState<{[id:string]: string}>({});
```

---

## Core Functions

### **Permission Helpers**

#### `getCurrentUserRole()`
Retrieves the logged-in user's role from localStorage.

```typescript
const getCurrentUserRole = () => {
  try {
    const userLogin = localStorage.getItem("userLogin");
    if (userLogin) {
      const userData = JSON.parse(userLogin);
      const user = userData?.data?.[0] || userData?.[0] || userData;
      return user.role || "USER";
    }
  } catch {
    return "USER";
  }
  return "USER";
};
```

**Returns:** `"MASTER"`, `"ADMIN"`, or `"USER"`

---

#### `canEditArticle(article)`
Checks if the current user has permission to edit/delete a specific article.

**Logic:**
1. Finds the article's author from the users array
2. Gets the author's role
3. **USER articles** → Always return `false` (cannot be edited by admin/master)
4. **ADMIN role** → Can edit only if author is ADMIN
5. **MASTER role** → Can edit if author is ADMIN or MASTER

```typescript
const canEditArticle = (article: any) => {
  const articleAuthor = users.find((user: any) => user.id === article.userId);
  if (!articleAuthor) return false;

  const authorRole = articleAuthor.role;

  // USER articles cannot be edited/deleted by ADMIN or MASTER
  if (authorRole === "USER") return false;

  // ADMIN can only edit ADMIN articles
  if (currentUserRole === "ADMIN" && authorRole === "ADMIN") return true;

  // MASTER can edit ADMIN and MASTER articles
  if (currentUserRole === "MASTER" && (authorRole === "ADMIN" || authorRole === "MASTER")) return true;

  return false;
};
```

**Returns:** `true` if user can edit, `false` otherwise

---

### **Event Handlers**

#### `handleStatusChange(id, value)`
Updates an article's visibility status (public/private).

```typescript
const handleStatusChange = async (id: string, value: string) => {
  setStatusEdits((prev) => ({ ...prev, [id]: value }));
  try {
    await axios.patch(`${import.meta.env.VITE_SV_HOST}/articles/${id}`, { status: value });
    dispatch(fetchArticles());
    message.success("Article status updated successfully!");
  } catch {
    message.error("Failed to update article status!");
  }
};
```

---

#### `handleEdit(article)`
Opens a modal to edit article title and content.

**Permission Check:**
```typescript
if (!canEditArticle(article)) {
  message.error("You don't have permission to edit this article!");
  return;
}
```

**Features:**
- Pre-fills form with current article data
- Validates fields are not empty
- Updates article via PATCH request
- Shows success/error notifications

---

#### `handleDelete(article)`
Opens a confirmation modal before deleting an article.

**Permission Check:**
```typescript
if (!canEditArticle(article)) {
  message.error("You don't have permission to delete this article!");
  return;
}
```

**Features:**
- Warning message about permanent deletion
- Deletes article via DELETE request
- Refreshes article list
- Shows success/error notifications

---

## UI Components

### **Header Section**
- **Add New Article Button** - Purple button with icon linking to add article page
- **Title** - "Article Management" with total article count

### **Article Table**

| Column | Description |
|--------|-------------|
| **Ảnh** | Article thumbnail image (80x64px) |
| **Tiêu đề** | Article title |
| **Chủ đề** | Category name |
| **Nội dung** | Truncated content preview |
| **Vai trò** | Author's role badge (MASTER/ADMIN/USER) |
| **Trạng thái** | Current visibility status |
| **Chỉnh sửa trạng thái** | Dropdown to change status |
| **Hành động** | Edit and Delete buttons |

### **Role Badge Colors**
```typescript
const roleColor = 
  authorRole === "MASTER" ? "bg-purple-100 text-purple-700" : 
  authorRole === "ADMIN" ? "bg-blue-100 text-blue-700" : 
  "bg-gray-100 text-gray-700";
```

- 🟣 **MASTER** - Purple badge
- 🔵 **ADMIN** - Blue badge
- ⚪ **USER** - Gray badge

### **Button States**

#### Enabled (Editable Article)
```html
<button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
  Sửa
</button>
```

#### Disabled (Non-Editable Article)
```html
<button 
  className="px-3 py-1 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
  disabled
>
  Sửa
</button>
```

---

## Data Flow

### **On Component Mount**
1. Dispatch `fetchArticles()` to load all articles from API
2. Dispatch `fetchUsers()` to load all users for role checking
3. Component re-renders when data arrives

### **On Edit/Delete Click**
1. Check `canEditArticle(article)` permission
2. If unauthorized → Show error message and return
3. If authorized → Proceed with modal/action
4. Update backend via axios
5. Refresh articles list via `dispatch(fetchArticles())`
6. Show success/error notification

---

## API Endpoints

### **GET** `/articles`
Fetch all articles (via Redux)

### **PATCH** `/articles/:id`
Update article status, title, or content
```typescript
axios.patch(`${VITE_SV_HOST}/articles/${id}`, { status: "public" })
```

### **DELETE** `/articles/:id`
Delete an article
```typescript
axios.delete(`${VITE_SV_HOST}/articles/${id}`)
```

---

## Security Considerations

### **Client-Side Permission Checks**
- Permission checks are enforced in UI (disabled buttons, error messages)
- **⚠️ Important:** Backend should also validate permissions to prevent API bypass

### **Recommended Backend Validation**
```typescript
// Express.js example
app.patch('/articles/:id', authenticateUser, async (req, res) => {
  const article = await Article.findById(req.params.id);
  const author = await User.findById(article.userId);
  
  // Enforce same rules as frontend
  if (author.role === "USER") {
    return res.status(403).json({ error: "Cannot edit user articles" });
  }
  
  if (req.user.role === "ADMIN" && author.role !== "ADMIN") {
    return res.status(403).json({ error: "Admins can only edit admin articles" });
  }
  
  if (req.user.role === "MASTER" && !["ADMIN", "MASTER"].includes(author.role)) {
    return res.status(403).json({ error: "Insufficient permissions" });
  }
  
  // Proceed with update...
});
```

---

## User Experience

### **Loading State**
```
[Spinner Icon]
Loading articles...
```

### **Error State**
```
[Error Icon]
{error message}
```

### **Empty State**
```
[Document Icon]
No articles yet
```

### **Permission Denied**
```
⚠️ You don't have permission to edit this article!
⚠️ You don't have permission to delete this article!
```

---

## Pagination

- **Items per page:** 5 articles
- **Navigation:** Previous / Page Numbers / Next
- **Active page:** Purple highlight
- **Disabled state:** Gray text when on first/last page

---

## Usage Example

```typescript
// User logs in as ADMIN
localStorage.setItem("userLogin", JSON.stringify({
  data: [{
    id: "123",
    role: "ADMIN",
    email: "admin@example.com"
  }]
}));

// Navigate to /admin/articles
<AdminArticles />

// ADMIN sees:
// ✅ Edit/Delete buttons ENABLED for ADMIN articles (blue buttons)
// ❌ Edit/Delete buttons DISABLED for MASTER articles (gray buttons)
// ❌ Edit/Delete buttons DISABLED for USER articles (gray buttons)
```

---

## Future Enhancements

### Potential Improvements
1. **Bulk Operations** - Select multiple articles for batch delete/status change
2. **Advanced Filters** - Filter by category, status, author, date range
3. **Search Functionality** - Search articles by title or content
4. **Sort Options** - Sort by date, title, author, status
5. **Export Data** - Export article list as CSV/Excel
6. **Activity Log** - Track who edited/deleted which articles
7. **Undo Delete** - Soft delete with restore option
8. **Image Preview** - Click thumbnail to view full-size image
9. **Rich Text Editor** - Enhanced editing with formatting options
10. **Drag-and-Drop Reorder** - Manually order articles

---

## Troubleshooting

### Issue: "You don't have permission" error when editing
**Solution:** Check that:
1. Your role in localStorage matches your actual permissions
2. The article author's role is compatible with your role
3. Users data has been fetched successfully

### Issue: Buttons stay disabled for all articles
**Solution:** 
1. Verify `fetchUsers()` is called on mount
2. Check browser console for API errors
3. Ensure `users` array in Redux state is populated

### Issue: Status changes don't persist
**Solution:**
1. Check network tab for failed PATCH requests
2. Verify backend API is running
3. Check `VITE_SV_HOST` environment variable is correct

---

## Related Components

- **`Admin_add_articles.tsx`** - Form to create new articles
- **`layouts/admin/Header.tsx`** - Admin dashboard header
- **`layouts/admin/Sidebar_menu.tsx`** - Admin navigation menu
- **`store/slices/articleSlice.ts`** - Redux slice for article state
- **`store/slices/userSlice.ts`** - Redux slice for user state

---

## Code Location
```
📁 src/
  📁 pages/
    📁 admin/
      📄 Admin_articles.tsx ← This component
      📄 ADMIN_ARTICLES_README.md ← This documentation
```

---

**Last Updated:** November 1, 2025  
**Version:** 1.0  
**Author:** React Blog Project Team
