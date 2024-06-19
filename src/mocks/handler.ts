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
    introduction?: string; // 자기소개
    followers?: number;
    following?: number;
    id: string; // ID 추가
}

interface Post {
    id: number;
    text: string;
    image?: string;
    comments: { id: number; text: string }[];
}

const users: User[] = [
    {
        email: 'valid@example.com',
        password: '123',
        nickname: 'lavie_music',
        region: 'ALL',
        part: 'BAND',
        type: 'GUITAR',
        profileImage: '/profile.jpeg',
        introduction: '안녕하세요.', // 유저 자기소개
        followers: 100,
        following: 200,
        id: '1',
    },
    {
        email: 'newuser@example.com',
        password: 'password123!',
        nickname: 'newuser',
        region: 'ALL',
        part: 'VOCAL',
        profileImage: '/profile.jpeg',
        introduction: 'New user bio',
        followers: 50,
        following: 100,
        id: '2',
    },
];

const certificationCodes: { [email: string]: string } = {};

const posts: Post[] = [
    {
        id: 1,
        text: '첫 번째 게시물 입니다',
        image: '/band.png',
        comments: [
            { id: 1, text: '첫 번째 댓글' },
            { id: 2, text: '두 번째 댓글' },
        ],
        userNickname: 'lavie_music',
    },
    {
        id: 2,
        text: '두 번째 게시물',
        image: '/dance.png',
        comments: [{ id: 3, text: '세 번째 댓글' }],
        userNickname: 'lavie_music',
    },
];

const performanceRecords = [
    {
        id: 1,
        userNickname: 'lavie_music',
        description: '첫 번째 공연 기록',
        address: '서울시 강남구',
        date: '2023-06-19',
        part: 'BAND',
        type: 'GUITAR',
        region: 'GANGNAMGU',
        latitude: 37.4979,
        longitude: 127.0276,
    },
    {
        id: 2,
        userNickname: 'lavie_music',
        description: '두 번째 공연 기록',
        address: '서울시 용산구',
        date: '2023-06-20',
        part: 'BAND',
        type: 'VOCAL',
        region: 'YONGSANGU',
        latitude: 37.5326,
        longitude: 126.9906,
    },
    {
        id: 3,
        userNickname: 'newuser',
        description: '새 사용자 첫 번째 공연 기록',
        address: '서울시 종로구',
        date: '2023-06-21',
        part: 'VOCAL',
        type: 'VOCAL',
        region: 'JONGNOGU',
        latitude: 37.5729,
        longitude: 126.9793,
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

        users.push({ email, password, nickname, region, part, type, id: `${users.length + 1}` });
        delete certificationCodes[email];

        return res(
            ctx.status(200),
            ctx.json({
                result: true,
                message: '회원가입에 성공했습니다!',
                email,
                nickname,
                region,
                part,
                type,
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
                    email: user.email,
                    nickname: user.nickname,
                    region: user.region,
                    part: user.part,
                    type: user.type,
                    profileImage: user.profileImage,
                    introduction: user.introduction,
                    followers: user.followers,
                    following: user.following,
                    id: user.id,
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
            return res(
                ctx.status(200),
                ctx.json({
                    email: user.email,
                    nickname: user.nickname,
                    region: user.region,
                    part: user.part,
                    type: user.type,
                    profileImage: user.profileImage,
                    introduction: user.introduction,
                    followers: user.followers,
                    following: user.following,
                    id: user.id,
                })
            );
        }
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }),

    // 추가된 다이나믹 라우팅을 위한 핸들러
    rest.get('/mypage/:id', async (req, res, ctx) => {
        const { id } = req.params;
        const user = users.find((user) => user.id === id);
        if (user) {
            return res(
                ctx.status(200),
                ctx.json({
                    email: user.email,
                    nickname: user.nickname,
                    region: user.region,
                    part: user.part,
                    type: user.type,
                    profileImage: user.profileImage,
                    introduction: user.introduction,
                    followers: user.followers,
                    following: user.following,
                    id: user.id,
                })
            );
        }
        return res(ctx.status(404), ctx.json({ message: 'User not found' }));
    }),

    rest.post('/logout', async (req, res, ctx) => {
        return res(
            ctx.cookie('session', '', { path: '/', expires: new Date(0) }),
            ctx.status(200),
            ctx.json({ message: '로그아웃에 성공했습니다!' })
        );
    }),

    // Posts handlers
    rest.get('/mypage/posts', async (req, res, ctx) => {
        const session = req.cookies['session'];
        if (session === 'fake-session-token') {
            const user = users[0]; // 항상 첫 번째 유저의 정보를 반환합니다.
            const userPosts = posts.filter((post) => post.userNickname === user.nickname);
            return res(ctx.status(200), ctx.json(userPosts));
        }
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }),

    rest.get('/mypage/posts/:id', async (req, res, ctx) => {
        const { id } = req.params;
        const user = users.find((user) => user.id === id);
        if (user) {
            const userPosts = posts.filter((post) => post.userNickname === user.nickname);
            if (userPosts.length > 0) {
                return res(ctx.status(200), ctx.json(userPosts));
            }
        }
        return res(ctx.status(404), ctx.json({ message: 'Posts not found for this user' }));
    }),

    rest.post('/mypage/write', async (req, res, ctx) => {
        const session = req.cookies['session'];
        if (session === 'fake-session-token') {
            const user = users[0]; // 항상 첫 번째 유저의 정보를 반환합니다.
            const text = await req.text();
            const formData = new URLSearchParams(text);
            const postText = formData.get('text') as string;
            const imageFile = formData.get('image') as string;

            const newPost: Post = {
                id: posts.length + 1,
                text: postText,
                image: URL.createObjectURL(new Blob([imageFile])),
                comments: [],
            };
            posts.push(newPost);
            return res(ctx.status(201), ctx.json(newPost));
        }
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }),

    rest.post('/mypage/write/:id', async (req, res, ctx) => {
        const { id } = req.params;
        const user = users.find((user) => user.id === id);
        if (user) {
            const text = await req.text();
            const formData = new URLSearchParams(text);
            const postText = formData.get('text') as string;
            const imageFile = formData.get('image') as string;

            const newPost: Post = {
                id: posts.length + 1,
                text: postText,
                image: URL.createObjectURL(new Blob([imageFile])),
                comments: [],
            };
            posts.push(newPost);
            return res(ctx.status(201), ctx.json(newPost));
        }
        return res(ctx.status(404), ctx.json({ message: 'User not found' }));
    }),

    // Performance records handlers
    rest.get('/mypage/performance', async (req, res, ctx) => {
        const session = req.cookies['session'];
        if (session === 'fake-session-token') {
            const user = users[0]; // 항상 첫 번째 유저의 정보를 반환합니다.
            const userRecords = performanceRecords.filter((record) => record.userNickname === user.nickname);
            return res(ctx.status(200), ctx.json(userRecords));
        }
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }),

    rest.get('/mypage/performance/:id', async (req, res, ctx) => {
        const { id } = req.params;
        const user = users.find((user) => user.id === id);
        if (user) {
            const userRecords = performanceRecords.filter((record) => record.userNickname === user.nickname);
            if (userRecords.length > 0) {
                return res(ctx.status(200), ctx.json(userRecords));
            }
        }
        return res(ctx.status(404), ctx.json({ message: 'Performance records not found for this user' }));
    }),

    rest.post('/mypage/performance/write', async (req, res, ctx) => {
        const session = req.cookies['session'];
        if (session === 'fake-session-token') {
            const user = users[0]; // 항상 첫 번째 유저의 정보를 반환합니다.

            try {
                const formData = await req.formData();
                const description = formData.get('description') as string;
                const address = formData.get('address') as string;
                const date = formData.get('date') as string;
                const part = formData.get('part') as string;
                const type = formData.get('type') as string;
                const region = formData.get('region') as string;
                const latitude = parseFloat(formData.get('latitude') as string);
                const longitude = parseFloat(formData.get('longitude') as string);

                const newRecord = {
                    id: performanceRecords.length + 1,
                    userNickname: user.nickname,
                    description,
                    address,
                    date,
                    part,
                    type,
                    region,
                    latitude,
                    longitude,
                };

                performanceRecords.push(newRecord);
                return res(ctx.status(201), ctx.json(newRecord));
            } catch (error) {
                console.error('Error handling formData:', error);
                return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
            }
        }
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }),

    rest.post('/mypage/performance/write/:id', async (req, res, ctx) => {
        const { id } = req.params;
        const user = users.find((user) => user.id === id);
        if (user) {
            try {
                const formData = await req.formData();
                const description = formData.get('description') as string;
                const address = formData.get('address') as string;
                const date = formData.get('date') as string;
                const part = formData.get('part') as string;
                const type = formData.get('type') as string;
                const region = formData.get('region') as string;
                const latitude = parseFloat(formData.get('latitude') as string);
                const longitude = parseFloat(formData.get('longitude') as string);

                const newRecord = {
                    id: performanceRecords.length + 1,
                    userNickname: user.nickname,
                    description,
                    address,
                    date,
                    part,
                    type,
                    region,
                    latitude,
                    longitude,
                };

                performanceRecords.push(newRecord);
                return res(ctx.status(201), ctx.json(newRecord));
            } catch (error) {
                console.error('Error handling formData:', error);
                return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
            }
        }
        return res(ctx.status(404), ctx.json({ message: 'User not found' }));
    }),
];
