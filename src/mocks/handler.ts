import { rest } from 'msw';
import { Post, PerformanceRecord } from '@/types/types';
import image from 'next/image';

interface User {
    email: string;
    password: string;
    nickname: string;
    region?: string;
    part?: string;
    type?: string;
    profileImage?: string;
    profileUrl?: string;
    introduction?: string;
    followers?: number;
    following?: number;
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
        profileUrl: '/profile.jpeg',
        introduction: '안녕하세요',
        followers: 100,
        following: 200,
    },
    {
        email: 'newuser@example.com',
        password: 'password123!',
        nickname: 'lee',
        region: 'ALL',
        part: 'VOCAL',
        profileImage: '/band.png',
        profileUrl: '/profile2.jpeg',
        introduction: 'New user bio',
        followers: 50,
        following: 100,
    },
];

const posts: Post[] = [
    {
        id: '1',
        text: '첫 번째 게시물',
        image: '/dance.png',
        userNickname: 'lavie_music',
        userProfileImage: '/profile.jpeg',
        comments: [
            {
                id: '22',
                text: '첫 번째 댓글',
                userNickname: 'newuser',
                userProfileImage: '/profile.jpeg',
            },
        ],
        likes: 10,
    },
    {
        id: '2',
        text: '두 번째 게시물',
        image: '/band.png',
        userNickname: 'lavie_music',
        userProfileImage: '/profile.jpeg',
        comments: [
            {
                id: '11',
                text: '첫 번째 댓글',
                userNickname: 'newuser',
                userProfileImage: '/profile.jpeg',
            },
        ],
        likes: 5,
    },
];

const performanceRecords: PerformanceRecord[] = [
    {
        id: '1',
        description: 'First performance',
        part: 'BAND',
        type: 'ROCK',
        latitude: 37.5665,
        longitude: 126.978,
        region: '서울',
        address: 'Seoul, South Korea',
        date: '2023-06-01',
        userNickname: 'lavie_music', // 추가
    },
    {
        id: '2',
        description: 'Second performance',
        part: 'DANCE',
        type: 'HIPHOP',
        latitude: 37.5675,
        longitude: 126.977,
        region: '서울',
        address: 'Seoul, South Korea',
        date: '2023-07-01',
        userNickname: 'lavie_music', // 추가
    },
    {
        id: '3',
        description: 'Third performance',
        part: 'VOCAL',
        type: 'POP',
        latitude: 37.5685,
        longitude: 126.979,
        region: '서울',
        address: 'Seoul, South Korea',
        date: '2023-08-01',
        userNickname: 'lavie_music', // 추가
    },
    {
        id: '4',
        description: 'Fourth performance',
        part: 'BAND',
        type: 'JAZZ',
        latitude: 37.5695,
        longitude: 126.976,
        region: '서울',
        address: 'Seoul, South Korea',
        date: '2023-09-01',
        userNickname: 'lavie_music', // 추가
    },
];

// 유틸리티 함수: 본문을 FormData로 변환
const parseMultipartFormData = (body: string): FormData => {
    const formData = new FormData();
    const boundary = body.split('\r\n')[0];
    const parts = body.split(boundary).filter((part) => part.trim() !== '--' && part.trim() !== '');

    parts.forEach((part) => {
        const [rawHeaders, rawValue] = part.split('\r\n\r\n');
        const headers = rawHeaders.split('\r\n').reduce(
            (acc, header) => {
                const [key, value] = header.split(': ');
                acc[key.toLowerCase()] = value;
                return acc;
            },
            {} as Record<string, string>
        );

        if (headers['content-disposition']) {
            const nameMatch = headers['content-disposition'].match(/name="(.+?)"/);
            const filenameMatch = headers['content-disposition'].match(/filename="(.+?)"/);

            if (nameMatch) {
                const name = nameMatch[1];
                const value = rawValue.slice(0, -2); // Remove the trailing CRLF

                if (filenameMatch) {
                    const filename = filenameMatch[1];
                    const file = new File([value], filename, { type: headers['content-type'] });
                    formData.append(name, file);
                } else {
                    formData.append(name, value);
                }
            }
        }
    });

    return formData;
};

export const handlers = [
    rest.post('/login', async (req, res, ctx) => {
        const { email, password } = req.body as { email: string; password: string };
        const user = users.find((user) => user.email === email && user.password === password);
        if (user) {
            const sessionCookie = 'fake-session-token';
            return res(
                ctx.status(200),
                ctx.cookie('session', sessionCookie, { path: '/' }),
                ctx.json({
                    message: '로그인에 성공했습니다!',
                    user: {
                        email: user.email,
                        nickname: user.nickname,
                        region: user.region,
                        part: user.part,
                        type: user.type,
                        profileUrl: user.profileUrl,
                        introduction: user.introduction,
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

    rest.post('/logout', async (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.cookie('session', '', { path: '/', expires: new Date(0) }),
            ctx.json({ message: '로그아웃에 성공했습니다!' })
        );
    }),

    rest.get('/memberInfo', async (req, res, ctx) => {
        const session = req.cookies['session'];
        if (session === 'fake-session-token') {
            const user = users[0];
            return res(
                ctx.status(200),
                ctx.json({
                    nickname: user.nickname,
                    profileUrl: user.profileUrl,
                })
            );
        }
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }),

    rest.get('/mypage/:nickname', async (req, res, ctx) => {
        const { nickname } = req.params as { nickname: string };
        console.log('Fetching user with nickname:', nickname);
        const user = users.find((user) => user.nickname === nickname);
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
                })
            );
        }
        return res(ctx.status(404), ctx.json({ message: 'User not found' }));
    }),

    rest.patch('/member/update', (req, res, ctx) => {
        const { nickname, profileImage, region, part, type, introduction } = req.body as User;
        const user = users.find((user) => user.nickname === nickname);
        if (user) {
            user.profileImage = profileImage || user.profileImage;
            user.region = region || user.region;
            user.part = part || user.part;
            user.type = type || user.type;
            user.introduction = introduction || user.introduction;

            return res(
                ctx.status(200),
                ctx.json({
                    profileImage: user.profileImage,
                    nickname: user.nickname,
                    region: user.region,
                    part: user.part,
                    type: user.type,
                    introduction: user.introduction,
                })
            );
        }
        return res(ctx.status(404), ctx.json({ message: 'User not found' }));
    }),

    rest.get('/mypage/photo/:nickname', async (req, res, ctx) => {
        const { nickname } = req.params as { nickname: string };
        const userPosts = posts.filter((post) => post.userNickname === nickname);
        return res(ctx.status(200), ctx.json(userPosts));
    }),

    rest.get('/mypage/photo/:nickname/:postId', async (req, res, ctx) => {
        const { nickname, postId } = req.params as { nickname: string; postId: string };
        const post = posts.find((post) => post.userNickname === nickname && post.id === postId);
        if (post) {
            return res(ctx.status(200), ctx.json(post));
        }
        return res(ctx.status(404), ctx.json({ message: 'Post not found' }));
    }),

    rest.post('/mypage/performance/write', async (req, res, ctx) => {
        const body = await req.text();
        const formData = parseMultipartFormData(body);
        const description = formData.get('description') as string;
        const address = formData.get('address') as string;
        const date = formData.get('date') as string;
        const part = formData.get('part') as string;
        const type = formData.get('type') as string;
        const region = formData.get('region') as string;
        const latitude = parseFloat(formData.get('latitude') as string);
        const longitude = parseFloat(formData.get('longitude') as string);
        const userNickname = formData.get('userNickname') as string;

        const newRecord: PerformanceRecord = {
            id: (performanceRecords.length + 1).toString(),
            description,
            address,
            date,
            part: part as 'BAND' | 'DANCE' | 'VOCAL',
            type,
            region,
            latitude,
            longitude,
            userNickname,
        };

        performanceRecords.push(newRecord);
        return res(ctx.status(201), ctx.json(newRecord));
    }),

    rest.get('/mypage/performance/:nickname', async (req, res, ctx) => {
        const { nickname } = req.params as { nickname: string };
        const userRecords = performanceRecords.filter((record) => record.userNickname === nickname);
        return res(ctx.status(200), ctx.json(userRecords));
    }),

    rest.post('/mypage/photo/:postId/like', async (req, res, ctx) => {
        const { postId } = req.params;
        const post = posts.find((post) => post.id === postId);

        if (post) {
            post.likes += 1;
            return res(ctx.status(200), ctx.json(post));
        }

        return res(ctx.status(404), ctx.json({ message: 'Post not found' }));
    }),
];
