import { rest } from 'msw';
import { Post } from '@/types/types';

interface User {
    email: string;
    password: string;
    nickname: string;
    region?: string;
    part?: string;
    type?: string;
    profileUrl?: string;
    introduction?: string; // 자기소개
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
        profileUrl: '',
        introduction: '안녕하세요',
        followers: 100,
        following: 200,
    },
    {
        email: 'newuser@example.com',
        password: 'password123!',
        nickname: 'newuser',
        region: 'ALL',
        part: 'VOCAL',
        profileUrl: '/profile.jpeg',
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
    },
];

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
            // Mock setting a cookie for authentication
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
        // 세션을 삭제
        return res(
            ctx.status(200),
            ctx.cookie('session', '', { path: '/', expires: new Date(0) }),
            ctx.json({ message: '로그아웃에 성공했습니다!' })
        );
    }),

    rest.get('/memberInfo', async (req, res, ctx) => {
        // 쿠키에서 세션 확인 후 사용자 정보 반환하도록 수정
        const session = req.cookies['session'];
        if (session === 'fake-session-token') {
            const user = users[0]; // 항상 첫 번째 유저의 정보를 반환합니다.
            return res(ctx.status(200), ctx.json(user));
        }
        return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
    }),

    rest.get('/mypage/:nickname', async (req, res, ctx) => {
        const { nickname } = req.params;
        console.log('Fetching user with nickname:', nickname); // 로그 추가
        const user = users.find((user) => user.nickname === nickname);
        if (user) {
            return res(ctx.status(200), ctx.json(user));
        }
        return res(ctx.status(404), ctx.json({ message: 'User not found' }));
    }),
    rest.get('/mypage/photo/:nickname', async (req, res, ctx) => {
        const { nickname } = req.params;
        const userPosts = posts.filter((post) => post.userNickname === nickname);
        return res(ctx.status(200), ctx.json(userPosts));
    }),

    rest.get('/mypage/photo/:nickname/:postId', async (req, res, ctx) => {
        const { nickname, postId } = req.params;
        const post = posts.find((post) => post.userNickname === nickname && post.id === postId);
        if (post) {
            return res(ctx.status(200), ctx.json(post));
        }
        return res(ctx.status(404), ctx.json({ message: 'Post not found' }));
    }),
];
