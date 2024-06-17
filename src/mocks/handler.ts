import { rest } from 'msw';

interface User {
    email: string;
    password: string;
    nickname: string;
    region?: string;
    part?: string;
    subPart?: string;
    profileImage?: string;
    bio?: string;
    followers?: number;
    following?: number;
}

const users: User[] = [
    {
        email: 'valid@example.com',
        password: 'password123!',
        nickname: 'validuser',
        region: 'ALL',
        part: 'BAND',
        subPart: 'GUITAR',
        profileImage: 'https://via.placeholder.com/150',
        bio: 'This is a bio',
        followers: 100,
        following: 200,
    },
    {
        email: 'newuser@example.com',
        password: 'password123!',
        nickname: 'newuser',
        region: 'ALL',
        part: 'VOCAL',
        profileImage: 'https://via.placeholder.com/150',
        bio: 'New user bio',
        followers: 50,
        following: 100,
    },
];

const certificationCodes: { [email: string]: string } = {};

export const handlers = [
    rest.post('/register/email-check', async (req, res, ctx) => {
        const { email } = req.body as { email: string };
        const emailExists = users.some((user) => user.email === email);
        return res(ctx.status(200), ctx.json({ exist: emailExists }));
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

    rest.post('/nickname-check', async (req, res, ctx) => {
        const { nickname } = req.body as { nickname: string };
        if (users.some((user) => user.nickname === nickname)) {
            return res(ctx.status(400), ctx.json({ message: '이미 사용 중인 닉네임입니다.' }));
        }
        return res(ctx.status(200), ctx.json({ message: '사용 가능한 닉네임입니다.' }));
    }),

    rest.post('/register', async (req, res, ctx) => {
        const { email, password, nickname, region, part, subPart } = req.body as User;
        if (email && password && nickname) {
            users.push({ email, password, nickname, region, part, subPart });
            delete certificationCodes[email];
            return res(
                ctx.status(200),
                ctx.json({
                    result: true,
                    message: '회원가입에 성공했습니다!',
                    user: { email, nickname, region, part, subPart },
                })
            );
        }
        return res(ctx.status(400), ctx.json({ result: false, message: '회원가입에 실패했습니다.' }));
    }),

    rest.post('/login', async (req, res, ctx) => {
        const { email, password } = req.body as User;
        const user = users.find((user) => user.email === email && user.password === password);
        if (user) {
            return res(
                ctx.status(200),
                ctx.json({
                    message: '로그인에 성공했습니다!',
                    user: {
                        email: user.email,
                        nickname: user.nickname,
                        region: user.region,
                        part: user.part,
                        subPart: user.subPart,
                    },
                })
            );
        }
        return res(
            ctx.status(400),
            ctx.json({ message: '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.' })
        );
    }),

    rest.get('/user/info', async (req, res, ctx) => {
        const user = users[0];
        return res(ctx.status(200), ctx.json(user));
    }),
];
