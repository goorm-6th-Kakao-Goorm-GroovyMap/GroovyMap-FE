export interface Comment {
    id: number;
    author: string;
    content: string;
}

export interface Post {
    id: number;
    title: string;
    author: string;
    content: string;
    date: string;
    views: number;
    position: string;
    region: string;
    recruit_num: number;
}
