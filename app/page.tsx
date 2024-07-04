'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const Home = () => {
    const [activeButton, setActiveButton] = useState('공연/연습장소');
    const [isMapHovered, setIsMapHovered] = useState(false);

    useEffect(() => {
        const interBubble = document.querySelector('.interactive');
        let curX = 0;
        let curY = 0;
        let tgX = 0;
        let tgY = 0;

        const move = () => {
            curX += (tgX - curX) / 20;
            curY += (tgY - curY) / 20;
            interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
            requestAnimationFrame(move);
        };

        window.addEventListener('mousemove', (event) => {
            tgX = event.clientX;
            tgY = event.clientY;
        });

        move();
    }, []);

    const handleButtonClick = (button) => {
        setActiveButton(button);
    };

    const handleMouseEnter = () => {
        setIsMapHovered(true);
    };

    const handleMouseLeave = () => {
        setIsMapHovered(false);
    };

    const renderContent = () => {
        switch (activeButton) {
            case '공연/연습장소':
                return (
                    <div className="content-container w-full relative">
                        <div
                            className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Image
                                src="/map.png"
                                alt="Map"
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                            />
                            <div className="absolute bottom-40 right-40 bg-purple-500 py-4 px-8 rounded-lg">
                                <p className="text-white">
                                    지도위의 마커를 통해, <br />
                                    분야별, 공연 장소를 찾아보세요{' '}
                                </p>
                            </div>
                            <div className="absolute bottom-4 right-4">
                                <button className="cursor-pointer p-2 rounded-full bg-purple-500 text-white hover:bg-purple-700 transition">
                                    &rarr;
                                </button>
                            </div>
                            {isMapHovered && (
                                <Image
                                    src="/markers2.png"
                                    alt="Markers"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="absolute top-0 left-0 w-full h-full"
                                />
                            )}
                        </div>
                    </div>
                );
            case '프로필':
                return (
                    <div className="content-container w-full relative">
                        <div
                            className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Image
                                src="/map.png"
                                alt="Map"
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                            />
                            <Image
                                src="/profileImage.png"
                                alt="Profile"
                                width={150}
                                height={150}
                                className="absolute z-50 top-14 right-48  shadow-lg"
                            />
                            <div className="absolute bottom-28 right-40 bg-white py-4 px-6 rounded-lg">
                                <p className="text-purple-600">
                                    기타, 건반, 키보드, 드럼, 댄스 등, <br />
                                    다양한 분야의 사람들과 교류하세요.{' '}
                                </p>
                            </div>
                            <div className="absolute bottom-4 right-4">
                                <button className="cursor-pointer p-2 rounded-full bg-purple-500 text-white hover:bg-purple-700 transition">
                                    &rarr;
                                </button>
                            </div>
                            {isMapHovered && (
                                <Image
                                    src="/markers.png"
                                    alt="Markers"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="absolute top-0 left-0 w-full h-full"
                                />
                            )}
                        </div>
                    </div>
                );
            case '팀원 모집':
                return (
                    <div className="content-container w-full relative">
                        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                            <Image
                                src="/recruitImage.png"
                                alt="Recruit"
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                            />
                            <div className="absolute bottom-4 right-4">
                                <button className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-700 transition">
                                    &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case '공연 홍보':
                return (
                    <div className="content-container w-full relative">
                        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                            <Image
                                src="/promotionImage.png"
                                alt="Promote"
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                            />
                            <div className="absolute bottom-4 right-4">
                                <button className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-700 transition">
                                    &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="main-container flex min-h-screen flex-col items-center p-6 bg-[rgb(253,253,255)]">
            <div className="content flex-1 w-full max-w-6xl relative rounded-lg">
                <div className="mb-6 gradient-bg relative w-full h-64 md:h-80 lg:h-96">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                        <p className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                            함께하는 무대, 함께하는 열정
                        </p>
                        <p className="text-lg md:text-2xl lg:text-3xl font-extrabold text-white mt-1 relative">
                            그루비맵에서 최고의 멤버를 찾아보세요.
                        </p>
                        <p className="text-xl mt-3 font-medium">
                            밴드, 댄스 등 <span className="text-purple-600">다양한 분야</span>의 멤버를 찾아,
                            <br /> 함께 공연을 만들어보세요.
                        </p>
                    </div>
                    <svg viewBox="0 0 100% 100%" xmlns="http://www.w3.org/2000/svg" className="noise z-0">
                        <filter id="noiseFilter">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.85"
                                numOctaves="6"
                                stitchTiles="stitch"
                            />
                        </filter>
                        <rect
                            width="100%"
                            height="100%"
                            preserveAspectRatio="xMidYMid meet"
                            filter="url(#noiseFilter)"
                        />
                    </svg>
                    <div className="gradients-container absolute inset-0">
                        <div className="g1"></div>
                        <div className="g2"></div>
                        <div className="g3"></div>
                        <div className="g4"></div>
                        <div className="g5"></div>
                        <div className="interactive"></div>
                    </div>
                </div>

                <div className="relative p-6 rounded-xl text-center flex flex-col items-center mb-12">
                    <p className="text-md md:text-xl lg:text-xl items-center font-medium text-black mb-4">
                        공연 영상을 <span className="text-purple-500">업로드</span> 하고, <br />
                        <span className="text-purple-500">포트폴리오</span>를 쌓으며 사람들과 교류하세요.
                    </p>
                    <div className="mt-3 flex flex-row justify-center space-x-4">
                        <button
                            className={`button-custom transition-colors duration-300 mr-2 py-2 px-4 rounded-lg shadow-md mb-4 ${
                                activeButton === '공연/연습장소' ? 'bg-purple-500 text-white' : 'text-black'
                            }`}
                            onClick={() => handleButtonClick('공연/연습장소')}
                        >
                            공연/연습장소
                        </button>
                        <button
                            className={`button-custom transition-colors duration-300 mr-2 py-2 px-4 rounded-lg shadow-md mb-4 ${
                                activeButton === '프로필' ? 'bg-purple-500 text-white' : 'text-black'
                            }`}
                            onClick={() => handleButtonClick('프로필')}
                        >
                            프로필
                        </button>
                        <button
                            className={`button-custom transition-colors duration-300 mr-2 py-2 px-4 rounded-lg shadow-md mb-4 ${
                                activeButton === '팀원 모집' ? 'bg-purple-500 text-white' : 'text-black'
                            }`}
                            onClick={() => handleButtonClick('팀원 모집')}
                        >
                            팀원 모집
                        </button>
                        <button
                            className={`button-custom transition-colors duration-300 mr-2 py-2 px-4 rounded-lg shadow-md mb-4 ${
                                activeButton === '공연 홍보' ? 'bg-purple-500 text-white' : 'text-black'
                            }`}
                            onClick={() => handleButtonClick('공연 홍보')}
                        >
                            공연 홍보
                        </button>
                    </div>
                    <div className="mt-6 w-full flex justify-center">{renderContent()}</div>
                </div>
            </div>
        </main>
    );
};

export default Home;
