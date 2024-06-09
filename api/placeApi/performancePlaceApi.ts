import type { PerformancePlace } from '../../types/types';
import apiClient from '../apiClient';

//전체 공연 장소 정보 가져옴
export const getPerformancePlaces = async (): Promise<PerformancePlace[]> => {
    const response = await apiClient.get('/performanceplace');
    console.log('API 응답 데이터:', response.data); // API 응답 데이터 로그 출력
    return response.data;
};

//하나의 공연 장소 정보 저장
export const addPerformancePlace = async (place: Omit<PerformancePlace, 'id'>): Promise<PerformancePlace> => {
    const response = await apiClient.post('/performanceplace', place);
    return response.data;
};

// 특정 공연 장소의 상세 정보를 가져오는 함수
export const getPerformancePlaceDetails = async (postId: number): Promise<PerformancePlace> => {
    const response = await apiClient.get(`/performanceplace/${postId}`);
    return response.data;
};

export default apiClient;
