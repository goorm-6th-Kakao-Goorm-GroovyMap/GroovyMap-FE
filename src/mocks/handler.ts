import { rest } from 'msw';

// Temporary in-memory storage for users
const users: Array<{ email: string; password: string; nickname: string }> = [
    { email: 'valid@example.com', password: 'password123!', nickname: 'validuser' },
    { email: 'newuser@example.com', password: 'password123!', nickname: 'newuser' },
];

const parseFormData = async (req: any) => {
    const formData = await req.formData();
    const data: { [key: string]: string } = {};
    formData.forEach((value: string, key: string) => {
        data[key] = value;
    });
    return data;
};

export const handlers = [
    // Handler for sending email code
    rest.post('/register/send-certification', async (req, res, ctx) => {
        const data = await parseFormData(req);
        const { email } = data;
        if (users.some((user) => user.email === email)) {
            return res(
                ctx.status(400),
                ctx.json({ status: 4003, message: '이미 가입된 유저 이메일입니다. 다른 이메일을 사용해주세요.' })
            );
        }
        return res(ctx.status(200), ctx.json({ message: '이메일 인증 요청을 보냈습니다. 인증코드를 입력해 주세요.' }));
    }),

    // Handler for validating email code
    rest.get('/register/certificate-code', (req, res, ctx) => {
        const email = req.url.searchParams.get('email');
        const code = req.url.searchParams.get('code');

        if (email === 'valid@example.com' && code === '123456') {
            return res(ctx.status(200), ctx.json({ message: '이메일 인증에 성공했습니다!' }));
        }
        return res(ctx.status(400), ctx.json({ message: '이메일 인증에 실패했습니다.' }));
    }),

    // Handler for checking nickname
    rest.post('/register/nickname-check', async (req, res, ctx) => {
        const data = await parseFormData(req);
        const { nickname } = data;
        if (users.some((user) => user.nickname === nickname)) {
            return res(ctx.status(400), ctx.json({ message: '이미 사용 중인 닉네임입니다.' }));
        }
        return res(ctx.status(200), ctx.json({ message: '사용 가능한 닉네임입니다.' }));
    }),

    // Handler for signing up
    rest.post('/register', async (req, res, ctx) => {
        const data = await parseFormData(req);
        const { email, password, nickname } = data;
        if (email && password && nickname) {
            users.push({ email, password, nickname });
            return res(ctx.status(200), ctx.json({ message: '회원가입에 성공했습니다!', user: { email, nickname } }));
        }
        return res(ctx.status(400), ctx.json({ message: '회원가입에 실패했습니다.' }));
    }),

    // Handler for logging in
    rest.post('/login', async (req, res, ctx) => {
        const data = await parseFormData(req);
        const { email, password } = data;
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
