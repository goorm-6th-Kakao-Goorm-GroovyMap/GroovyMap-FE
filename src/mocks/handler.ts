import { rest } from 'msw';
import type { PerformancePlace, PracticePlace } from '@/types/types';

interface User {
    email: string;
    password: string;
    nickname: string;
    region?: string;
    part?: string;
    type?: string;
    profileImage?: string;
    bio?: string; // 자기소개
    followers?: number;
    following?: number;
}

const users: User[] = [
    {
        email: 'valid@example.com',
        password: '123',
        nickname: 'validuser',
        region: 'ALL',
        part: 'BAND',
        type: 'GUITAR',
        profileImage: '/profile.jpeg',
        bio: '안녕하세요.',
        followers: 100,
        following: 200,
    },
    {
        email: 'newuser@example.com',
        password: 'password123!',
        nickname: 'newuser',
        region: 'ALL',
        part: 'VOCAL',
        profileImage: '/profile.jpeg',
        bio: 'New user bio',
        followers: 50,
        following: 100,
    },
];

const certificationCodes: { [email: string]: string } = {};

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
    // User authentication and registration handlers
    rest.post('/register/email-check', async (req, res, ctx) => {
        const { email } = req.body as { email: string };
        const emailExists = users.some((user) => user.email === email);
        return res(ctx.status(200), ctx.json({ available: !emailExists }));
    }),

    rest.post('/register/send-certification', async (req, res, ctx) => {
        const { email } = req.body as { email: string };
        if (users.some((user) => user.email === email)) {
            return res(
                ctx.status(400),
                ctx.json({ status: 4003, message: '이미 가입된 유저 이메일입니다. 다른 이메일을 사용해주세요.' })
            );
        }
        const code = '123456';
        certificationCodes[email] = code;
        return res(ctx.status(200), ctx.json({ message: '이메일 인증 요청을 보냈습니다. 인증코드를 입력해 주세요.' }));
    }),

    rest.post('/register/certificate-code', async (req, res, ctx) => {
        const { email, certificationCode } = req.body as { email: string; certificationCode: string };
        if (certificationCodes[email] === certificationCode) {
            return res(ctx.status(200), ctx.json({ result: true, message: '이메일 인증에 성공했습니다!' }));
        }
        return res(ctx.status(400), ctx.json({ result: false, message: '이메일 인증에 실패했습니다.' }));
    }),

    rest.post('/register/nickname-check', async (req, res, ctx) => {
        const { nickname } = req.body as { nickname: string };
        const nicknameExists = users.some((user) => user.nickname === nickname);
        return res(ctx.status(200), ctx.json({ available: !nicknameExists }));
    }),

    rest.post('/register', async (req, res, ctx) => {
        const { email, password, nickname, region, part, type } = req.body as User;
        console.log('Received payload:', req.body);

        if (!email || !password || !nickname) {
            return res(ctx.status(400), ctx.json({ result: false, message: '필수 필드가 누락되었습니다.' }));
        }

        if (users.some((user) => user.email === email)) {
            return res(ctx.status(400), ctx.json({ result: false, message: '이미 사용 중인 이메일입니다.' }));
        }

        users.push({ email, password, nickname, region, part, type });
        delete certificationCodes[email];

        return res(
            ctx.status(200),
            ctx.json({
                result: true,
                message: '회원가입에 성공했습니다!',
                user: { email, nickname, region, part, type },
            })
        );
    }),

    rest.post('/login', async (req, res, ctx) => {
        const { email, password } = req.body as { email: string; password: string };
        const user = users.find((user) => user.email === email && user.password === password);
        if (user) {
            const sessionCookie = 'fake-session-token';
            return res(
                ctx.cookie('session', sessionCookie, { path: '/' }),
                ctx.status(200),
                ctx.json({
                    message: '로그인에 성공했습니다!',
                    user: {
                        email: user.email,
                        nickname: user.nickname,
                        region: user.region,
                        part: user.part,
                        type: user.type,
                        profileImage: user.profileImage,
                        bio: user.bio,
                        followers: user.followers,
                        following: user.following,
                    },
                })
            );
        }
        return res(
            ctx.status(400),
            ctx.json({ message: '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.' })
        );
    }),

    rest.get('/mypage', async (req, res, ctx) => {
        const session = req.cookies['session'];
        if (session === 'fake-session-token') {
            const user = users[0]; // 항상 첫 번째 유저의 정보를 반환합니다.
            return res(ctx.status(200), ctx.json({ user }));
        }
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }),

    rest.post('/logout', async (req, res, ctx) => {
        return res(
            ctx.cookie('session', '', { path: '/', expires: new Date(0) }),
            ctx.status(200),
            ctx.json({ message: '로그아웃에 성공했습니다!' })
        );
    }),

    // Performance place handlers
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

    rest.post<PerformancePlace>('/performanceplace', (req, res, ctx) => {
        const newPlace: PerformancePlace = {
            ...req.body,
            id: performancePlaces.length + 1,
        };
        performancePlaces.push(newPlace);
        return res(ctx.status(201), ctx.json(newPlace));
    }),

    rest.get('/performanceplace/:postId', (req, res, ctx) => {
        const { postId } = req.params;
        const place = performancePlaces.find((place) => place.id === parseInt(postId as string, 10));
        if (!place) {
            return res(ctx.status(404), ctx.json({ error: 'Place not found' }));
        }
        return res(ctx.status(200), ctx.json(place));
    }),

    // Practice place handlers
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

    rest.post<PracticePlace>('/practiceplace', (req, res, ctx) => {
        const newPlace: PracticePlace = {
            ...req.body,
            id: practicePlaces.length + 1,
        };
        practicePlaces.push(newPlace);
        return res(ctx.status(201), ctx.json(newPlace));
    }),
    rest.get('/practiceplace/:postId', (req, res, ctx) => {
        const { postId } = req.params;
        const place = practicePlaces.find((place) => place.id === parseInt(postId as string, 10));
        if (!place) {
            return res(ctx.status(404), ctx.json({ error: 'Place not found' }));
        }
        return res(ctx.status(200), ctx.json(place));
    }),
];
