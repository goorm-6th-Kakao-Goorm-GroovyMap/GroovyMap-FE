'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Home() {
    return (
        <main className="main-container flex min-h-screen flex-col items-center p-6">
            <div className="content flex-1">
                <header className="header">
                    <h1>메인페이지</h1>
                    <h1>함께하는 무대, 함께하는 열정</h1>
                    <p>GroovyMap에서 최고의 멤버를 찾아보세요</p>
                    <button>팀원 모집</button>
                </header>
            </div>
        </main>
    );
}
