import { rest } from 'msw';
import type { PerformancePlace, PracticePlace } from '@/types/types';

const performancePlaces: PerformancePlace[] = [
    {
        id: 1,
        name: 'Performance Place 1',
        part: 'BAND',
        coordinate: { latitude: 35.6895, longitude: 139.6917 },
        region: 'YONGSANGU',
        address: '용산구',
        phoneNumber: '123-456-7890',
        rentalFee: '1000',
        capacity: '500',
        performanceHours: '9am - 9pm',
        description: 'Description 1',
    },
    {
        id: 2,
        name: 'Performance Place 2',
        part: 'BAND',
        coordinate: { latitude: 34.0522, longitude: -118.2437 },
        region: 'GANGNAMGU',
        address: '강남구',
        phoneNumber: '098-765-4321',
        rentalFee: '2000',
        capacity: '1000',
        performanceHours: '10am - 10pm',
        description: 'Description 2',
    },
];

const practicePlaces: PracticePlace[] = [
    {
        id: 1,
        name: 'Practice Place 1',
        part: 'BAND',
        coordinate: { latitude: 35.6895, longitude: 139.6917 },
        region: 'YONGSANGU',
        address: '용산구',
        phoneNumber: '123-456-7890',
        rentalFee: '1000',
        capacity: '500',
        practiceHours: '9am - 9pm',
        description: 'Description 1',
    },
    {
        id: 2,
        name: 'Practice Place 2',
        part: 'BAND',
        coordinate: { latitude: 34.0522, longitude: -118.2437 },
        region: 'GANGNAMGU',
        address: '용산구',
        phoneNumber: '098-765-4321',
        rentalFee: '2000',
        capacity: '1000',
        practiceHours: '10am - 10pm',
        description: 'Description 2',
    },
];

export const handlers = [
    // 전체 공연 장소 정보 가져옴
    rest.get('/performanceplace', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                performancePlacePosts: performancePlaces.map((place) => ({
                    ...place,
                })),
            })
        );
    }),

    // 하나의 공연 장소 정보 저장
    rest.post<PerformancePlace>('/performanceplace', (req, res, ctx) => {
        const newPlace: PerformancePlace = {
            ...req.body,
            id: performancePlaces.length + 1,
        };
        performancePlaces.push(newPlace);
        return res(ctx.status(201), ctx.json(newPlace));
    }),

    // 특정 공연 장소의 상세 정보를 가져옴
    rest.get('/performanceplace/:postId', (req, res, ctx) => {
        const { postId } = req.params;
        const place = performancePlaces.find((place) => place.id === parseInt(postId as string, 10));
        if (!place) {
            return res(ctx.status(404), ctx.json({ error: 'Place not found' }));
        }
        return res(ctx.status(200), ctx.json(place));
    }),

    // 전체 연습 장소 정보 가져옴
    rest.get('/practiceplace', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                practicePlacePosts: practicePlaces.map((place) => ({
                    ...place,
                })),
            })
        );
    }),

    // 하나의 연습 장소 정보 저장
    rest.post<PracticePlace>('/practiceplace', (req, res, ctx) => {
        const newPlace: PracticePlace = {
            ...req.body,
            id: practicePlaces.length + 1,
        };
        practicePlaces.push(newPlace);
        return res(ctx.status(201), ctx.json(newPlace));
    }),

    // 특정 연습 장소의 상세 정보를 가져옴
    rest.get('/practiceplace/:postId', (req, res, ctx) => {
        const { postId } = req.params;
        const place = practicePlaces.find((place) => place.id === parseInt(postId as string, 10));
        if (!place) {
            return res(ctx.status(404), ctx.json({ error: 'Place not found' }));
        }
        return res(ctx.status(200), ctx.json(place));
    }),
];
