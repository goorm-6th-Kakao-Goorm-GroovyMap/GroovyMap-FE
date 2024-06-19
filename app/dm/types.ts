export interface Message {
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
}

export interface ChatRoom {
    id: string;
    participants: number[];
    messages: Message[];
}
