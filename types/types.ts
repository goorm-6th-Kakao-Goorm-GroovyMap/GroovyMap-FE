interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface Place {
    id?: number;
    name: string;
    part: 'BAND' | 'DANCE' | 'VOCAL';
    coordinate: Coordinate;
    region: string;
    address: string;
    phoneNumber?: string;
    rentalFee?: string;
    capacity?: string;
    description?: string;
}

export interface PerformancePlace extends Place {
    performanceHours: string;
}

export interface PracticePlace extends Place {
    practiceHours: string;
}

export interface PerformancePlaceResponse {
    performancePlacePosts: PerformancePlace[];
}

export interface PracticePlaceResponse {
    practicePlacePosts: PracticePlace[];
}

// User와 Post 인터페이스 추가
export interface User {
    id: number;
    email: string;
    nickname: string;
    region: string;
    part: string;
    type: string;
    profileImage: string;
    introduction: string;
    followers: number;
    following: number;
}

export interface Comment {
    id: number;
    text: string;
    userNickname: string;
    userProfileImage: string;
}

export interface Post {
    id: number;
    text: string;
    image?: string;
    comments: Comment[];
    userNickname: string;
    userProfileImage: string;
}
