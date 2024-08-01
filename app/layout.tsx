'use client';

import React, { ReactNode, useState } from 'react';
import './globals.scss';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import { FaBars, FaHome, FaPaperPlane, FaList, FaUser } from 'react-icons/fa';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot, useRecoilValue, useResetRecoilState } from 'recoil';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '@/components/Logo/Logo';
import { userState } from '@/recoil/state/userState';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/apiClient';

const queryClient = new QueryClient();

function InnerLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [activeIcon, setActiveIcon] = useState<string>('home');
    const router = useRouter();
    const user = useRecoilValue(userState);
    const resetUser = useResetRecoilState(userState);

    const handleUserIconClick = () => {
        if (!user.nickname) {
            router.push('/login');
        } else {
            router.push(`/mypage/${user.nickname}`);
        }
    };

    const handleDMClick = () => {
        if (user.nickname) {
            router.push(`/dm/${user.nickname}`);
        }
    }

    const handleLogout = async () => {
        try {
            await apiClient.post('/logout', {}, { withCredentials: true });
            resetUser();
            if (typeof window !== 'undefined') {
                window.sessionStorage.removeItem('recoil-persist');
            }
            toast.success('로그아웃에 성공했습니다!');
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('로그아웃에 실패했습니다.');
        }
    };

    const handleMyPageClick = () => {
        if (user.nickname) {
            router.push(`/mypage/${user.nickname}`);
        }
    };

    const handleIconClick = (icon: string, path: string) => {
        setActiveIcon(icon);
        if (path) {
            router.push(path);
        }
    };

    return (
        <div className="h-full">
            {/* 작은 화면에서만 표시되는 헤더 */}
            <header className="mobile-header">
                <Logo />
            </header>
            {/* 큰 화면에서만 표시되는 기본 헤더 */}
            <header className="desktop-header">
            </header>
            <div className="main-layout">
                {/* Sidebar */}
                <div className={`sidebar ${sidebarOpen ? 'open' : ''} md:relative md:translate-x-0`}>
                    <Sidebar />
                </div>
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
                )}
                {/* Main Content */}
                <main className="content flex-grow flex flex-col overflow-y-auto">
                    {children}
                </main>
                {/* Right Sidebar */}
                <div className="hidden md:block h-full">
                    <RightSidebar />
                </div>
            </div>
            {/* 작은 화면에서만 표시되는 푸터 */}
            <footer className="footer">
                <div className="footer-icons">
                    <FaHome 
                        className={activeIcon === 'home' ? 'active' : ''}
                        onClick={() => handleIconClick('home', '/')}
                    />
                    <FaList 
                        className={activeIcon === 'menu' ? 'active' : ''}
                        onClick={() => handleIconClick('menu', '/menu')}
                    />
                    <FaPaperPlane 
                        className={activeIcon === 'dm'? 'active' : ''}
                        onClick={handleDMClick} 
                     />

                    <FaUser 
                        className={activeIcon === 'user' ? 'active' : ''}
                        onClick={handleUserIconClick}
                    />
                </div>
            </footer>
            {/* 사용자 메뉴 모달 */}
            {userMenuOpen && (
                <div className="menu-modal" onClick={() => setUserMenuOpen(false)}>
                    <div className="menu-content" onClick={(e) => e.stopPropagation()}>
                        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleMyPageClick}>
                            마이페이지
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="kr" className="h-full">
            <body className="h-full overflow-hidden">
                <RecoilRoot>
                    <QueryClientProvider client={queryClient}>
                        <InnerLayout>{children}</InnerLayout>
                        <ReactQueryDevtools initialIsOpen={false} />
                        <ToastContainer />
                    </QueryClientProvider>
                </RecoilRoot>
            </body>
        </html>
    );
}