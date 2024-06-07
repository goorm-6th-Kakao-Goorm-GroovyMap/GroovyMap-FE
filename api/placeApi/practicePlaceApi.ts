import apiClient from '../apiClient';
import type { PracticePlace } from '../../types/types';

// 전체 연습 장소 정보를 가져오는 함수
export const getPracticePlaces = async (): Promise<PracticePlace[]> => {
    const response = await apiClient.get('/practiceplace');
    return response.data;
};

// 하나의 연습 장소 정보를 저장하는 함수
export const addPracticePlace = async (place: Omit<PracticePlace, 'id'>): Promise<PracticePlace> => {
    const response = await apiClient.post('/practice', place);
    return response.data;
};

// 특정 연습 장소의 상세 정보를 가져오는 함수
export const getPracticePlaceDetails = async (postId: number): Promise<PracticePlace> => {
    const response = await apiClient.get(`/practiceplace/${postId}`);
    return response.data;
};
