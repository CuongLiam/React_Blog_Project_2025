// User related types
export interface user {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    avatar?: string;
}

// Category/Entry related types
export interface entry{
    id: number;
    name: string;
}

// Article related types
export interface article{
    id: number;
    title: string;
    entryId: number;
    userId: number;
    content: string;
    mood: string;
    status: string;
    category: string;
    image: string;
    date: string;
}

// Social interaction types
export interface like{
    id: number;
    articleId: number;
    userId: number;
    createdAt: string;
}

export interface reply{
    id: number;
    commentId: number;
    userId: number;
    content: string;
    createdAt: string;
}

export interface comment{
    id: number;
    articleId: number;
    userId: number;
    content: string;
    createdAt: string;
    replies?: reply[];
}