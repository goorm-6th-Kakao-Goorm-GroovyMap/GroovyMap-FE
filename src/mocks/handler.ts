import { rest } from 'msw';

interface User {
    email: string;
    password: string;
    nickname: string;
    region?: string;
    part?: string;
    type?: string;
    profileImage?: string;
    introduction?: string;
    followers?: number;
    following?: number;
    id: string;
}

interface Post {
    id: number;
    text: string;
    image?: string;
    comments: { id: number; text: string; userNickname: string; userProfileImage: string }[];
    userNickname: string;
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
        introduction: '안녕하세요.',
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

const posts: Post[] = [
    {
        id: 1,
        text: 'Mock Post 1',
        image: '/dance.png',
        comments: [{ id: 1, text: 'Nice post!', userNickname: 'commenter1', userProfileImage: '/profile1.jpeg' }],
        userNickname: 'lavie_music',
    },
    {
        id: 2,
        text: 'Mock Post 2',
        image: '/band.png',
        comments: [{ id: 2, text: 'Great post!', userNickname: 'commenter2', userProfileImage: '/profile2.jpeg' }],
        userNickname: 'lavie_music',
    },
];

const performanceRecords: any[] = [];

const certificationCodes: { [email: string]: string } = {};

export const handlers = [
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
            const user = { ...users[0] }; // 항상 첫 번째 유저의 정보를 반환합니다.
            return res(ctx.status(200), ctx.json(user));
        }
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }),

    // rest.get('/mypage/:id', (req, res, ctx) => {
    //     const { id } = req.params;
    //     const user = users.find((user) => user.id === id);
    //     if (user) {
    //         return res(ctx.status(200), ctx.json(user));
    //     } else {
    //         return res(ctx.status(404), ctx.json({ message: 'User not found' }));
    //     }
    // }),

    rest.post('/logout', async (req, res, ctx) => {
        return res(
            ctx.cookie('session', '', { path: '/', expires: new Date(0) }),
            ctx.status(200),
            ctx.json({ message: '로그아웃에 성공했습니다!' })
        );
    }),

    // Handlers for posts
    rest.get('/mypage/posts', (req, res, ctx) => {
        // 세션 토큰을 사용하여 사용자를 식별하고 적절한 데이터 반환
        const session = req.cookies['session'];
        if (session === 'fake-session-token') {
            const userPosts = posts.filter((post) => post.userNickname === 'lavie_music'); // 예시 사용자명
            return res(ctx.status(200), ctx.json(userPosts));
        }
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }),

    rest.get('/mypage/posts/:userId', async (req, res, ctx) => {
        const { userId } = req.params;
        const user = users.find((user) => user.id === userId);
        if (user) {
            const userPosts = posts.filter((post) => post.userNickname === user.nickname);
            return res(ctx.status(200), ctx.json(userPosts));
        }
        return res(ctx.status(404), ctx.json({ message: 'User not found' }));
    }),

    rest.post('/mypage/photo/write', async (req, res, ctx) => {
        const { text, image, userNickname } = req.body as { text: string; image?: string; userNickname: string };
        const newPost = {
            id: posts.length + 1,
            text,
            image,
            comments: [],
            userNickname,
        };
        posts.push(newPost);
        return res(ctx.status(200), ctx.json({ message: 'Post created successfully' }));
    }),

    rest.get('/mypage/photo', async (req, res, ctx) => {
        const userPosts = posts.map((post) => ({
            id: post.id,
            photoUrl: post.image,
        }));
        return res(ctx.status(200), ctx.json({ myPagePhotoDtos: userPosts }));
    }),

    rest.get('/mypage/photo/:postId', async (req, res, ctx) => {
        const { postId } = req.params;
        const post = posts.find((post) => post.id === parseInt(postId, 10));
        if (post) {
            return res(ctx.status(200), ctx.json(post));
        }
        return res(ctx.status(404), ctx.json({ message: 'Post not found' }));
    }),

    // Handlers for performance records
    rest.get('/mypage/performance', async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(performanceRecords));
    }),

    rest.get('/mypage/performance/:memberId', async (req, res, ctx) => {
        const { memberId } = req.params;
        const userRecords = performanceRecords.filter((record) => record.userId === memberId);
        if (userRecords) {
            return res(ctx.status(200), ctx.json(userRecords));
        }
        return res(ctx.status(404), ctx.json({ message: 'Performance records not found' }));
    }),

    rest.post('/mypage/performance/write', async (req, res, ctx) => {
        const { description, address, date, part, type, region, latitude, longitude } = req.body as {
            description: string;
            address: string;
            date: string;
            part: string;
            type: string;
            region: string;
            latitude: number;
            longitude: number;
        };
        const newRecord = {
            id: performanceRecords.length + 1,
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
        return res(ctx.status(200), ctx.json({ message: 'Performance record created successfully' }));
    }),
];
