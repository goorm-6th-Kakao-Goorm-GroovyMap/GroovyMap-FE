import Head from 'next/head';
import Chatlist from './chatlist';

export default function DMPage() {
    return (
        <main className="main-container flex min-h-screen flex-col items-center p-6">
            <div className="content flex-1">
                <header className="header">
                    <h1>DM</h1>
                </header>
                <section className="flex"></section>
            </div>
        </main>
    );
}
