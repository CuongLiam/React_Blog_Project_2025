export interface user {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    avatar?: string;
}

export interface entry{
    id: number;
    name: string;
}

export interface article{
    id: number;
    title: string;
    entryId: number;
    userId: number;
    content: string;
    mood: string;
    status: string;
    category: string; // category added
    image: string; // img
    date: string;
}

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