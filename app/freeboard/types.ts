import { DateTime } from 'luxon';

export interface Comment {
    id: number;
    author: string;
    content: string;
    date: DateTime;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    bookmarks: number;
    comments: Comment[];
    image?: string;
}
