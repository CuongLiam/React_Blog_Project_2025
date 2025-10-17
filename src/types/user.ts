export interface user {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
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
    image: string; // img
    date: string;
}