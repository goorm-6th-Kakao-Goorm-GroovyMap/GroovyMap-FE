//공연 장소 타입
export interface PerformancePlace {
    id: number;
    name: string;
    part: string;
    coordinate: { latitude: number; longitude: number };
    region: string;
    address: string;
    phoneNumber?: string;
    rentalFee?: string;
    capacity?: string;
    performanceHours?: string;
    description?: string;
}

//연습장소 타입
export interface PracticePlace {
    id: number;
    name: string;
    address: string;
    part: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    region: string;
    phoneNumber?: string;
    rentalFee?: string;
    capacity?: string;
    practiceHours?: string;
    description?: string;
}
