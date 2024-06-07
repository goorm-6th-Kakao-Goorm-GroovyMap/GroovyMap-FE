//공연 및 연습 장소 타입 설정
export interface PerformancePlace {
    id: number;
    name: string;
    part: 'BAND' | 'DANCE';
    coordinate: { latitude: number; longitude: number };
    region: string;
    address: string;
    phoneNumber: string;
    rentalFee: string;
    capacity: string;
    performanceHours: string;
    description: string;
}

export interface PracticePlace {
    id: number;
    name: string;
    part: 'BAND' | 'DANCE';
    coordinate: { latitude: number; longitude: number };
    region: string;
    address: string;
    phoneNumber: string;
    rentalFee: string;
    capacity: string;
    practiceHours: string;
    description: string;
}
