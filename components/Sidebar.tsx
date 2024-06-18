'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '../components/Logo/Logo'


const Sidebar = () => {
    const [activeLink, setActiveLink] = useState('')

    const handleLinkClick = (href: string) => {
        setActiveLink(href)
    }

    return (
        <aside className="sidebar flex flex-col items-center px-10">
            <div className="logo mb-28 mt-14">
                <Logo />
            </div>
            <nav className="menu">
                <ul className="space-y-2 text-center">
                    <li className="text-purple-500">Menu</li>
                    <li>
                        <Link
                            href="/"
                            className={activeLink === '/' ? 'text-purple-700' : ''}
                            onClick={() => handleLinkClick('/')}
                        >
                            홈
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/performance-place"
                            className={activeLink === '/performance-place' ? 'text-purple-700' : ''}
                            onClick={() => handleLinkClick('/performance-place')}
                        >
                            공연 장소
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/practice-place"
                            className={activeLink === '/practice-place' ? 'text-purple-700' : ''}
                            onClick={() => handleLinkClick('/practice-place')}
                        >
                            연습 장소
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            className={activeLink === '#' ? 'text-purple-700' : ''}
                            onClick={() => handleLinkClick('#')}
                        >
                            자유게시판
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/promotion-place"
                            className={activeLink === '/promotion-place' ? 'text-purple-700' : ''}
                            onClick={() => handleLinkClick('/promotion-place')}
                        >
                            홍보게시판
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            className={activeLink === '#' ? 'text-purple-700' : ''}
                            onClick={() => handleLinkClick('#')}
                        >
                            팀원 모집
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            className={activeLink === '#' ? 'text-purple-700' : ''}
                            onClick={() => handleLinkClick('#')}
                        >
                            프로필
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/alogogeneration"
                            className={activeLink === '/alogogeneration' ? 'text-purple-700' : ''}
                            onClick={() => handleLinkClick('/alogogeneration')}
                        >
                            AI 생성
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar
