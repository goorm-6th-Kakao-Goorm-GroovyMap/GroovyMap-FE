import { rest } from 'msw';

// Temporary in-memory storage for users and certification codes
interface User {
    email: string;
    password: string;
    nickname: string;
}

const users: User[] = [
    { email: 'valid@example.com', password: 'password123!', nickname: 'validuser' },
    { email: 'newuser@example.com', password: 'password123!', nickname: 'newuser' },
];

const certificationCodes: { [email: string]: string } = {};

export const handlers = [
    rest.post<Partial<User>>('/register/send-certification', async (req, res, ctx) => {
        const { email } = req.body as User;
        if (users.some((user) => user.email === email)) {
            return res(
                ctx.status(400),
                ctx.json({ status: 4003, message: '이미 가입된 유저 이메일입니다. 다른 이메일을 사용해주세요.' })
            );
        }
        // Generate a mock certification code
        const code = '123456';
        certificationCodes[email] = code;
        return res(ctx.status(200), ctx.json({ message: '이메일 인증 요청을 보냈습니다. 인증코드를 입력해 주세요.' }));
    }),

    rest.post<Partial<User & { certificationCode: string }>>('/register/certificate-code', async (req, res, ctx) => {
        const { email, certificationCode } = req.body as { email: string; certificationCode: string };
        if (certificationCodes[email] === certificationCode) {
            return res(ctx.status(200), ctx.json({ result: true, message: '이메일 인증에 성공했습니다!' }));
        }
        return res(ctx.status(400), ctx.json({ result: false, message: '이메일 인증에 실패했습니다.' }));
    }),

    rest.post<Partial<User>>('/register/nickname-check', async (req, res, ctx) => {
        const { nickname } = req.body as User;
        if (users.some((user) => user.nickname === nickname)) {
            return res(ctx.status(400), ctx.json({ message: '이미 사용 중인 닉네임입니다.' }));
        }
        return res(ctx.status(200), ctx.json({ message: '사용 가능한 닉네임입니다.' }));
    }),

    rest.post<Partial<User>>('/register', async (req, res, ctx) => {
        const { email, password, nickname } = req.body as User;
        if (email && password && nickname) {
            users.push({ email, password, nickname });
            // Remove certification code after successful registration
            delete certificationCodes[email];
            return res(
                ctx.status(200),
                ctx.json({ result: true, message: '회원가입에 성공했습니다!', user: { email, nickname } })
            );
        }
        return res(ctx.status(400), ctx.json({ result: false, message: '회원가입에 실패했습니다.' }));
    }),

    rest.post<Partial<User>>('/login', async (req, res, ctx) => {
        const { email, password } = req.body as User;
        const user = users.find((user) => user.email === email && user.password === password);
        if (user) {
            return res(
                ctx.status(200),
                ctx.json({ message: '로그인에 성공했습니다!', user: { email: user.email, nickname: user.nickname } })
            );
        }
        return res(
            ctx.status(400),
            ctx.json({ message: '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.' })
        );
    }),
];
