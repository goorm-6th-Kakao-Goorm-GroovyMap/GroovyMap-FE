interface Coordinate {
    latitude: number;
    longitude: number;
}

//연습 및 공연장소에서 필요함
export interface Place {
    id?: number | string;
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
    profileImage?: string;
    profileUrl?: string;
    email?: string;
    region?: string;
    part?: string;
    type?: string;
    introduction?: string;
    followers: string[]; // 팔로워 닉네임 목록
    following: string[]; // 팔로잉 닉네임 목록
}

export interface Comment {
    id: string; // UUID 형식으로 변경
    text: string;
    userNickname: string;
    userProfileImage: string;
    createdAt: string;
}

export interface Post {
    id: string; // UUID 형식으로 변경
    text: string;
    image?: string;
    comments: Comment[];
    userNickname: string;
    userProfileImage: string;
    likes: number;
    isLiked: boolean;
}

//마이페이지 공연기록 타입
export interface PerformanceRecord {
    id: string; // UUID 형식으로 변경
    description: string;
    part: 'BAND' | 'DANCE' | 'VOCAL';
    type: string;
    latitude: number;
    longitude: number;
    userNickname?: string;
    region: string;
    address: string;
    date: string;
}

//팔로워 팔로잉 사람 목록
export interface FollowRelation {
    followerNickname: string;
    followingNickname: string;
}
