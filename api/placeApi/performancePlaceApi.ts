import apiClient from '../apiClient';
import type { PerformancePlace } from '../../types/types';

export const getPerformancePlaces = async (): Promise<Place[]> => {
    const response = await apiClient.get('/performanceplace');
    return response.data;
};

export const addPerformancePlace = async (place: Omit<Place, 'id'>): Promise<Place> => {
    const response = await apiClient.post('/performanceplace', place);
    return response.data;
};
