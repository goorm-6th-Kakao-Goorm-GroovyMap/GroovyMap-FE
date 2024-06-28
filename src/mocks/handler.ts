// import { rest } from 'msw';
// import { Post, PerformanceRecord } from '@/types/types';

// interface User {
//     email: string;
//     password: string;
//     nickname: string;
//     region?: string;
//     part?: string;
//     type?: string;
//     profileImage?: string;
//     profileUrl?: string;
//     introduction?: string;
//     followers: number;
//     following: number;
// }

// const users: User[] = [
//     {
//         email: 'valid@example.com',
//         password: '123',
//         nickname: 'lavie_music',
//         region: 'ALL',
//         part: 'BAND',
//         type: 'GUITAR',
//         profileImage: '/profile.jpeg',
//         profileUrl: '/profile.jpeg',
//         introduction: '안녕하세요',
//         followers: 1,
//         following: 1,
//     },
//     {
//         email: 'newuser@example.com',
//         password: '123',
//         nickname: 'lee',
//         region: 'ALL',
//         part: 'VOCAL',
//         profileImage: '/band.png',
//         profileUrl: '/profile2.jpeg',
//         introduction: 'New user bio',
//         followers: 1,
//         following: 1,
//     },
//     {
//         email: 'example3@example.com',
//         password: 'password123!',
//         nickname: 'example3',
//         region: 'ALL',
//         part: 'DRUM',
//         profileImage: '/drum.png',
//         profileUrl: '/profile3.jpeg',
//         introduction: 'Example user bio',
//         followers: 1,
//         following: 1,
//     },
//     {
//         email: 'example4@example.com',
//         password: 'password123!',
//         nickname: 'example4',
//         region: 'ALL',
//         part: 'BASS',
//         profileImage: '/bass.png',
//         profileUrl: '/profile4.jpeg',
//         introduction: 'Example user bio',
//         followers: 1,
//         following: 1,
//     },
//     {
//         email: 'example5@example.com',
//         password: 'password123!',
//         nickname: 'example5',
//         region: 'ALL',
//         part: 'PIANO',
//         profileImage: '/piano.png',
//         profileUrl: '/profile5.jpeg',
//         introduction: 'Example user bio',
//         followers: 1,
//         following: 1,
//     },
// ];

// let followRelations: FollowRelation[] = [
//     { followerNickname: 'lee', followingNickname: 'lavie_music' },
//     { followerNickname: 'example3', followingNickname: 'lavie_music' },
//     { followerNickname: 'example4', followingNickname: 'lavie_music' },
//     { followerNickname: 'lavie_music', followingNickname: 'example3' },
//     { followerNickname: 'lavie_music', followingNickname: 'example4' },
//     { followerNickname: 'lavie_music', followingNickname: 'example5' },
// ];

// const performanceRecords: PerformanceRecord[] = [
//     {
//         id: '1',
//         description: 'First performance',
//         part: 'BAND',
//         type: 'ROCK',
//         latitude: 37.5665,
//         longitude: 126.978,
//         region: '서울',
//         address: 'Seoul, South Korea',
//         date: '2023-06-01',
//         userNickname: 'lavie_music',
//     },
//     // ...other records
// ];

// export const handlers = [
//     rest.post('/login', async (req, res, ctx) => {
//         const { email, password } = req.body as { email: string; password: string };
//         const user = users.find((user) => user.email === email && user.password === password);
//         if (user) {
//             const sessionCookie = 'fake-session-token';
//             return res(
//                 ctx.status(200),
//                 ctx.cookie('session', sessionCookie, { path: '/' }),
//                 ctx.json({
//                     message: '로그인에 성공했습니다!',
//                     user: {
//                         email: user.email,
//                         nickname: user.nickname,
//                         region: user.region,
//                         part: user.part,
//                         type: user.type,
//                         profileUrl: user.profileUrl,
//                         introduction: user.introduction,
//                         followers: user.followers,
//                         following: user.following,
//                     },
//                 })
//             );
//         }
//         return res(
//             ctx.status(400),
//             ctx.json({ message: '로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.' })
//         );
//     }),

//     rest.post('/logout', async (req, res, ctx) => {
//         return res(
//             ctx.status(200),
//             ctx.cookie('session', '', { path: '/', expires: new Date(0) }),
//             ctx.json({ message: '로그아웃에 성공했습니다!' })
//         );
//     }),

//     rest.get('/memberInfo', async (req, res, ctx) => {
//         const session = req.cookies['session'];
//         if (session === 'fake-session-token') {
//             const user = users[0];
//             return res(
//                 ctx.status(200),
//                 ctx.json({
//                     nickname: user.nickname,
//                     profileUrl: user.profileUrl,
//                 })
//             );
//         }
//         return res(ctx.status(403), ctx.json({ message: 'Unauthorized' }));
//     }),

//     rest.get('/mypage/:nickname', async (req, res, ctx) => {
//         const { nickname } = req.params as { nickname: string };
//         const user = users.find((user) => user.nickname === nickname);
//         if (user) {
//             return res(
//                 ctx.status(200),
//                 ctx.json({
//                     email: user.email,
//                     nickname: user.nickname,
//                     region: user.region,
//                     part: user.part,
//                     type: user.type,
//                     profileImage: user.profileImage,
//                     introduction: user.introduction,
//                     followers: user.followers,
//                     following: user.following,
//                 })
//             );
//         }
//         return res(ctx.status(404), ctx.json({ message: 'User not found' }));
//     }),

//     rest.patch('/member/update', (req, res, ctx) => {
//         const { nickname, profileImage, region, part, type, introduction } = req.body as User;
//         const user = users.find((user) => user.nickname === nickname);
//         if (user) {
//             user.profileImage = profileImage || user.profileImage;
//             user.region = region || user.region;
//             user.part = part || user.part;
//             user.type = type || user.type;
//             user.introduction = introduction || user.introduction;

//             return res(
//                 ctx.status(200),
//                 ctx.json({
//                     profileImage: user.profileImage,
//                     nickname: user.nickname,
//                     region: user.region,
//                     part: user.part,
//                     type: user.type,
//                     introduction: user.introduction,
//                 })
//             );
//         }
//         return res(ctx.status(404), ctx.json({ message: 'User not found' }));
//     }),

//     rest.post('/mypage/following', async (req, res, ctx) => {
//         const { nickname, followNickname } = req.body as { nickname: string; followNickname: string };
//         const user = users.find((user) => user.nickname === nickname);
//         const targetUser = users.find((user) => user.nickname === followNickname);

//         if (user && targetUser) {
//             if (
//                 !followRelations.some(
//                     (rel) => rel.followerNickname === nickname && rel.followingNickname === followNickname
//                 )
//             ) {
//                 followRelations.push({ followerNickname: nickname, followingNickname: followNickname });
//                 user.following += 1;
//                 targetUser.followers += 1;
//             }
//             return res(ctx.status(200), ctx.json({ success: true }));
//         }
//         return res(ctx.status(404), ctx.json({ success: false, message: 'User not found' }));
//     }),

//     rest.delete('/mypage/unfollow', async (req, res, ctx) => {
//         const { nickname, followNickname } = req.body as { nickname: string; followNickname: string };
//         const user = users.find((user) => user.nickname === nickname);
//         const targetUser = users.find((user) => user.nickname === followNickname);

//         if (user && targetUser) {
//             followRelations = followRelations.filter(
//                 (rel) => !(rel.followerNickname === nickname && rel.followingNickname === followNickname)
//             );
//             user.following -= 1;
//             targetUser.followers -= 1;
//             return res(ctx.status(200), ctx.json({ success: true }));
//         }
//         return res(ctx.status(404), ctx.json({ success: false, message: 'User not found' }));
//     }),

//     rest.get('/mypage/:nickname/followers', async (req, res, ctx) => {
//         const { nickname } = req.params as { nickname: string };
//         const user = users.find((user) => user.nickname === nickname);

//         if (user) {
//             const followers = followRelations
//                 .filter((rel) => rel.followingNickname === nickname)
//                 .map((rel) => users.find((u) => u.nickname === rel.followerNickname))
//                 .filter(Boolean) as User[];

//             return res(ctx.status(200), ctx.json(followers));
//         }
//         return res(ctx.status(404), ctx.json({ message: 'User not found' }));
//     }),

//     rest.get('/mypage/:nickname/following', async (req, res, ctx) => {
//         const { nickname } = req.params as { nickname: string };
//         const user = users.find((user) => user.nickname === nickname);

//         if (user) {
//             const following = followRelations
//                 .filter((rel) => rel.followerNickname === nickname)
//                 .map((rel) => users.find((u) => u.nickname === rel.followingNickname))
//                 .filter(Boolean) as User[];

//             return res(ctx.status(200), ctx.json(following));
//         }
//         return res(ctx.status(404), ctx.json({ message: 'User not found' }));
//     }),
// ];
