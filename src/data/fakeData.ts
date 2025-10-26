import type { article, entry, user, comment, reply, like } from "../types/user";

export let users: user[] = [
    {
        id: 1,
        firstname: "Lê",
        lastname: "Minh Thu",
        email: "minhthu@gmail.com",
        password: "123456",
        avatar: "https://avatar.iran.liara.run/public/1"
    },
    {
        id: 2,
        firstname: "An",
        lastname: "NguyenVan",
        email: "abc@gmail.com",
        password: "123456",
        avatar: "https://avatar.iran.liara.run/public/2"
    },
    {
        id: 3,
        firstname: "John",
        lastname: "Doe",
        email: "john@gmail.com",
        password: "123456",
        avatar: "https://avatar.iran.liara.run/public/3"
    },
];

export let entries: entry[] = [
    { id: 1, name: "Personal Diary" },
    { id: 2, name: "Work Log" },
    { id: 3, name: "Thoughts" },
    { id: 4, name: "Travel & Adventure" },
    { id: 5, name: "Health & Fitness" },
    { id: 6, name: "Food & Recipes" },
    { id: 7, name: "Technology" },
    { id: 8, name: "Books & Reading" },
    { id: 9, name: "Music & Entertainment" },
    { id: 10, name: "Family & Relationships" },
];

export let articles: article[] = [
    {
        id: 1,
        title: "A Productive Day at Work",
        entryId: 2,
        userId: 1,
        content: "Today was a really productive day at work. I managed to finish a report ahead of schedule and received positive feedback from my manager.",
        status: "public",
        mood: "happy",
        category: "Work & Career",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
        date: "2025-02-25",
    },
    {
        id: 2,
        title: "My First Job Interview Experience",
        entryId: 2,
        userId: 1,
        content: "I had my first job interview today! I was nervous at first, but as the conversation went on, I felt more confident.",
        status: "public",
        mood: "excited",
        category: "Work & Career",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
        date: "2025-02-24",
    },
    {
        id: 3,
        title: "Overthinking Everything",
        entryId: 3,
        userId: 2,
        content: "Lately, I have been overthinking everything. From small decisions to bigger life choices, I know I should trust myself.",
        status: "public",
        mood: "anxious",
        category: "Personal Thoughts",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600",
        date: "2025-02-23",
    },
    {
        id: 4,
        title: "Morning Reflections",
        entryId: 1,
        userId: 1,
        content: "Started my day with coffee and journaling. It's amazing how much clarity you can gain from just writing down your thoughts.",
        status: "public",
        mood: "peaceful",
        category: "Daily Journal",
        image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600",
        date: "2025-02-22",
    },
    {
        id: 5,
        title: "Dealing with Stress",
        entryId: 3,
        userId: 2,
        content: "Work has been overwhelming lately. I need to find better ways to manage stress and maintain work-life balance.",
        status: "public",
        mood: "stressed",
        category: "Emotions & Feelings",
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600",
        date: "2025-02-21",
    },
    {
        id: 6,
        title: "Weekend Adventures",
        entryId: 1,
        userId: 1,
        content: "Spent the weekend hiking with friends. Nature really has a way of refreshing your mind and soul.",
        status: "public",
        mood: "happy",
        category: "Daily Journal",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600",
        date: "2025-02-20",
    },
    {
        id: 7,
        title: "Career Growth Plans",
        entryId: 2,
        userId: 1,
        content: "Setting new career goals for this year. I want to learn new skills and take on more challenging projects.",
        status: "public",
        mood: "motivated",
        category: "Work & Career",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600",
        date: "2025-02-19",
    },
    {
        id: 8,
        title: "Gratitude Journal",
        entryId: 1,
        userId: 2,
        content: "Taking time to appreciate the small things in life. Family, friends, health - these are the things that truly matter.",
        status: "public",
        mood: "grateful",
        category: "Personal Thoughts",
        image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600",
        date: "2025-02-18",
    },
    {
        id: 9,
        title: "Feeling Overwhelmed",
        entryId: 3,
        userId: 2,
        content: "Sometimes life feels like too much. But I'm learning to take things one step at a time and ask for help when needed.",
        status: "public",
        mood: "overwhelmed",
        category: "Emotions & Feelings",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
        date: "2025-02-17",
    },
];

export let likes: like[] = [
    { id: 1, articleId: 1, userId: 1, createdAt: "2025-02-25T10:00:00Z" },
    { id: 2, articleId: 1, userId: 2, createdAt: "2025-02-25T11:00:00Z" },
    { id: 3, articleId: 1, userId: 3, createdAt: "2025-02-25T12:00:00Z" },
    { id: 4, articleId: 2, userId: 1, createdAt: "2025-02-24T10:00:00Z" },
    { id: 5, articleId: 3, userId: 2, createdAt: "2025-02-23T10:00:00Z" },
];

export let replies: reply[] = [
    {
        id: 1,
        commentId: 1,
        userId: 2,
        content: "very good!",
        createdAt: "2025-02-25T11:00:00Z"
    },
    {
        id: 2,
        commentId: 1,
        userId: 3,
        content: "hello rikkei!",
        createdAt: "2025-02-25T12:00:00Z"
    },
];

export let comments: comment[] = [
    {
        id: 1,
        articleId: 1,
        userId: 1,
        content: "Today was a really productive day at work. I managed to finish a report ahead of schedule and received positive feedback from my manager. After work, I went for a walk in the park, enjoying the fresh air. Looking forward to another great day tomorrow!",
        createdAt: "2025-02-25T10:00:00Z"
    },
    {
        id: 2,
        articleId: 1,
        userId: 2,
        content: "Great job! Keep up the good work!",
        createdAt: "2025-02-25T11:30:00Z"
    },
    {
        id: 3,
        articleId: 2,
        userId: 1,
        content: "Interviews can be nerve-wracking, but you did great!",
        createdAt: "2025-02-24T10:00:00Z"
    },
];