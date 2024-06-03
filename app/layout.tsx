import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Groovy Map',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="main-layout">
                    <Sidebar />
                    <div className="content">{children}</div>
                </div>
            </body>
        </html>
    );
}
