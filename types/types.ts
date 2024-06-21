interface Coordinate {
    latitude: number;
    longitude: number;
}

//연습 및 공연장소에서 필요함
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

// 마이페이지에서 User와 Post 인터페이스 추가
export interface User {
    nickname: string;
    profileUrl?: string;
    email?: string;
    region?: string;
    part?: string;
    type?: string;
    introduction?: string;
    followers?: number;
    following?: number;
}

export interface Comment {
    id: string; // UUID 형식으로 변경
    text: string;
    userNickname: string;
    userProfileImage: string;
}

export interface Post {
    id: string; // UUID 형식으로 변경
    text: string;
    image?: string;
    comments: Comment[];
    userNickname: string;
    userProfileImage: string;
}

//마이페이지 공연기록 타입
export interface PerformanceRecord {
    id: string; // UUID 형식으로 변경
    description: string;
    part: 'BAND' | 'DANCE' | 'VOCAL';
    type: string;
    latitude: number;
    longitude: number;
    region: string;
    address: string;
    date: string;
}
