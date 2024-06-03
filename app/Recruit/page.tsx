import React from 'react';
import KakaoMap from './kakaoMap';

export default function RecruitingPage() {
    const locations = [
        { lat: 33.450701, lng: 126.570667 },
        { lat: 33.450935, lng: 126.569477 },
    ];
    return (
        <main className="main-container flex min-h-screen flex-col items-center p-6">
            <div className="content flex-1">
                <header className="header">
                    <h1>팀원 모집</h1>
                </header>
                <section>
                    <p>팀원 모집 페이지의 내용입니다.</p>
                </section>
                <KakaoMap locations={locations} />
            </div>
        </main>
    );
}
