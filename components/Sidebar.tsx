'use client';

import Link from 'next/link';
import Logo from '../components/Logo/Logo';
const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo">
                <Logo />
            </div>
            <nav className="menu">
                <ul>
                    <li>
                        <Link href="/">메인 페이지</Link>
                    </li>
                    <li>
                        <Link href="/performance-place">공연 장소</Link>
                    </li>
                    <li>
                        <Link href="/practice-place">연습 장소</Link>
                    </li>
                    <li>
                        <Link href="#">자유게시판</Link>
                    </li>
                    <li>
                        <Link href="#">홍보게시판</Link>
                    </li>
                    <li>
                        <Link href="#">팀원 모집</Link>
                    </li>
                    <li>
                        <Link href="#">프로필</Link>
                    </li>
                    <li>
                        <Link href="#">AI 생성</Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
