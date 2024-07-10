import apiClient from '../apiClient';
import type { PracticePlace, PracticePlaceResponse } from '../../types/types';

// 전체 연습 장소 정보를 가져오는 함수
export const getPracticePlaces = async (): Promise<PracticePlaceResponse> => {
    const response = await apiClient.get('/practiceplace');
    console.log('API 응답 데이터:', response.data); // API 응답 데이터 로그 출력
    return response.data;
};

// 하나의 연습 장소 정보를 저장하는 함수
export const addPracticePlace = async (place: Omit<PracticePlace, 'id'>): Promise<PracticePlace> => {
    const response = await apiClient.post('/practiceplace', place);
    return response.data;
};

// 특정 연습 장소의 상세 정보를 가져오는 함수
export const getPracticePlaceDetails = async (postId: number): Promise<PracticePlace> => {
    const response = await apiClient.get(`/practiceplace/${postId}`);
    return response.data;
};
