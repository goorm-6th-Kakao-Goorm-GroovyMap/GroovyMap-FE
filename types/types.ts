interface Coordinate {
    latitude: number;
    longitude: number;
}

interface PlaceBase {
    name: string;
    part: 'BAND' | 'DANCE' | 'VOCAL';
    coordinate: Coordinate;
    region: string;
    address: string;
    phoneNumber: string;
    rentalFee: string;
    capacity: string;
    description: string;
}

export interface PerformancePlace extends PlaceBase {
    id?: number;
    performanceHours: string;
}

export interface PracticePlace extends PlaceBase {
    id?: number;
    practiceHours: string;
}

export interface PerformancePlaceResponse {
    performancePlacePosts: PerformancePlace[];
}

export interface PracticePlaceResponse {
    practicePlacePosts: PracticePlace[];
}
