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
