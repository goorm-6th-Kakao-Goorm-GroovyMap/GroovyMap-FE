'use client';

import Link from 'next/link';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo">GroovyMap</div>
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
                        <Link href="/Recruit">팀원 모집</Link>
                    </li>
                    <li>
                        <Link href="#">프로필</Link>
                    </li>
                    <li>
                        <Link href="/dm">DM</Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
