'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import './globals.scss';
import Sidebar from '@/components/Sidebar';
import RightSidebar from '@/components/RightSidebar';
import { FaBars } from 'react-icons/fa';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot } from 'recoil'; //상태관리
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [queryClient] = useState(() => new QueryClient());

    return (
        <html lang="kr" className="h-full">
            <body className="h-full overflow-x-hidden">
                <RecoilRoot>
                    <QueryClientProvider client={queryClient}>
                        <div className="main-layout flex h-full">
                            {/* 메뉴 아이콘 */}
                            <div className="block md:hidden p-4">
                                <FaBars size={22} onClick={() => setSidebarOpen(!sidebarOpen)} />
                            </div>
                            {/* 사이드바 */}
                            <div
                                className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-white shadow-lg z-50 h-full`}
                            >
                                <Sidebar />
                            </div>
                            {sidebarOpen && (
                                <div
                                    className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40"
                                    onClick={() => setSidebarOpen(false)}
                                ></div>
                            )}
                            {/* 메인 콘텐츠 */}
                            <div className="flex-grow flex flex-col">{children}</div>
                            {/* 오른쪽 사이드바 */}
                            <div className="hidden md:block h-full">
                                <RightSidebar />
                            </div>
                        </div>
                        <ReactQueryDevtools initialIsOpen={false} />
                        <ToastContainer />
                    </QueryClientProvider>
                </RecoilRoot>
            </body>
        </html>
    );
}
