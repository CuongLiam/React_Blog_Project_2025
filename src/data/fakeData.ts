import type { article, entry, user } from "../types/user";

export let users : user[] = [
    {
        id: 1,
        firstname: "Lê",
        lastname: "Minh Thu",
        email: "minhthu@gmail.com",
        password: "123456"
    },
    {
        id: 2,
        firstname: "An",
        lastname: "NguyenVan",
        email: "abc@gmail.com",
        password: "123456"
    },

]

export let entries: entry[]=[
    {
        id: 1,
        name: "Tôi bị gei"
    },
    {
        id: 2,
        name: "Tôi bình thường"
    },
    {
        id: 3,
        name: "Tôi bất thường"
    },
    
]

export let articles: article[]=[
    {
        id: 1,
        title: "first ever deadline of this semester",
        entryId: 1,
        userId: 1,
        content: "today i blah blah blah, content...",
        status: "private",
        mood: "happy",
        image: "image1.png",
        date: "2025-10-17",
    },
    {
        id: 2,
        title: " second deadline of this semester",
        entryId: 2,
        userId: 2,
        content: "today i blah blah blah, content...",
        status: "private",
        mood: "happy",
        image: "image1.png",
        date: "2025-10-17",
    },
    {
        id: 3,
        title: " 3rd deadline of this semester",
        entryId: 3,
        userId: 3,
        content: "today i blah blah blah, content...",
        status: "private",
        mood: "happy",
        image: "image1.png",
        date: "2025-10-17",
    },
    {
        id: 4,
        title: " 4rd deadline of this semester",
        entryId: 4,
        userId: 4,
        content: "today i blah blah blah, content...",
        status: "private",
        mood: "happy",
        image: "image1.png",
        date: "2025-10-17",
    },

]