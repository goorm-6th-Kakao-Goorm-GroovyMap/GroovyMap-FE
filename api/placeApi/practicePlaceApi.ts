import apiClient from '../apiClient';
import type { PracticePlace } from '../../types/types';

export const getPracticePlaces = async (): Promise<Place[]> => {
    const response = await apiClient.get('/practiceplace');
    return response.data;
};

export const addPracticePlace = async (place: Omit<Place, 'id'>): Promise<Place> => {
    const response = await apiClient.post('/practiceplace', place);
    return response.data;
};
