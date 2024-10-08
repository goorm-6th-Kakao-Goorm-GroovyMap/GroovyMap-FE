'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Home = () => {
    const router = useRouter();
    const [activeButton, setActiveButton] = useState('공연/연습장소');
    const [isMapHovered, setIsMapHovered] = useState(false);

    useEffect(() => {
        const interBubble = document.querySelector('.interactive') as HTMLElement | null;
        let curX = 0;
        let curY = 0;
        let tgX = 0;
        let tgY = 0;

        const move = () => {
            if (interBubble) {
                curX += (tgX - curX) / 20;
                curY += (tgY - curY) / 20;
                interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
            }
            requestAnimationFrame(move);
        };

        window.addEventListener('mousemove', (event) => {
            tgX = event.clientX;
            tgY = event.clientY;
        });

        move();
    }, []);

    const handleButtonClick = (button: string) => {
        setActiveButton(button);
    };

    const handleButtonUrlClick = (url: string) => {
        router.push(url);
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
                            className="relative w-full h-24 xs:h-32 sm:h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Image
                                src="/map.png"
                                alt="Map"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                            />
                            <div className="absolute bottom-2 right-2 xs:bottom-4 xs:right-4 sm:bottom-10 sm:right-10 bg-purple-500 py-1 px-2 xs:py-2 xs:px-4 sm:py-4 sm:px-8 rounded-lg text-xs xs:text-sm sm:text-base">
                                <p className="text-white">
                                    지도위의 마커를 통해, <br />
                                    분야별, 공연 장소를 찾아보세요{' '}
                                </p>
                            </div>

                            {isMapHovered && (
                                <Image
                                    src="/markers2.png"
                                    alt="Markers"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{ objectFit: 'contain' }}
                                    className="absolute top-0 left-0 w-full h-full"
                                />
                            )}
                        </div>
                        <div className="absolute bottom-1 right-1 xs:bottom-2 xs:right-2 sm:bottom-4 sm:right-4">
                            <button
                                onClick={() => handleButtonUrlClick('/performance-place')}
                                className="cursor-pointer px-1 py-1 xs:px-2 xs:py-2 sm:px-4 sm:py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-700 transition text-xs xs:text-sm sm:text-base"
                            >
                                &rarr;
                            </button>
                        </div>
                    </div>
                );
            case '프로필':
                return (
                    <div className="content-container w-full relative">
                        <div
                            className="relative w-full h-24 xs:h-32 sm:h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Image
                                src="/map.png"
                                alt="Map"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                            />
                            <div className="profile-image-wrapper absolute z-50 top-2 right-2 xs:top-4 xs:right-4 sm:top-10 sm:right-10 md:top-14 md:right-48">
                                <div className="relative w-8 h-8 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full">
                                    <Image
                                        src="/profileImage.png"
                                        alt="Profile"
                                        priority
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                        className="profile-image shadow-lg rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="absolute bottom-2 right-2 xs:bottom-4 xs:right-4 sm:bottom-10 sm:right-10 bg-white py-1 px-2 xs:py-2 xs:px-4 sm:py-4 sm:px-6 rounded-lg text-xs xs:text-sm sm:text-base">
                                <p className="text-purple-600">
                                    기타, 건반, 키보드, 드럼, 댄스 등, <br />
                                    다양한 분야의 사람들과 교류하세요.{' '}
                                </p>
                            </div>

                            {isMapHovered && (
                                <Image
                                    src="/markers.png"
                                    alt="Markers"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{ objectFit: 'contain' }}
                                    className="absolute top-0 left-0 w-full h-full"
                                />
                            )}
                        </div>
                        <div className="absolute bottom-1 right-1 xs:bottom-2 xs:right-2 sm:bottom-4 sm:right-4">
                            <button
                                onClick={() => handleButtonUrlClick('/profile')}
                                className="cursor-pointer px-1 py-1 xs:px-2 xs:py-2 sm:px-4 sm:py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-700 transition text-xs xs:text-sm sm:text-base"
                            >
                                &rarr;
                            </button>
                        </div>
                    </div>
                );
            case '팀원 모집':
                return (
                    <div className="content-container w-full relative">
                        <div className="relative w-full h-24 xs:h-32 sm:h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden">
                            <Image
                                src="/recruitImage.png"
                                alt="Recruit"
                                fill
                                priority
                                quality={100}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                            />

                            <div className="absolute bottom-1 right-1 xs:bottom-2 xs:right-2 sm:bottom-4 sm:right-4">
                                <button
                                    onClick={() => handleButtonUrlClick('/recruitboard')}
                                    className="cursor-pointer px-1 py-1 xs:px-2 xs:py-2 sm:px-4 sm:py-2 rounded-xl bg-gray-200 text-purple-700 hover:bg-purple-700 hover:text-white transition text-xs xs:text-sm sm:text-base"
                                >
                                    &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case '공연 홍보':
                return (
                    <div className="content-container w-full relative">
                        <div className="relative w-full h-24 xs:h-32 sm:h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden">
                            <Image
                                src="/promotionImage.png"
                                alt="Promote"
                                fill
                                priority
                                quality={100}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                            />
                            <div className="absolute bottom-1 right-1 xs:bottom-2 xs:right-2 sm:bottom-4 sm:right-4">
                                <button
                                    onClick={() => handleButtonUrlClick('/promotion-place')}
                                    className="cursor-pointer px-1 py-1 xs:px-2 xs:py-2 sm:px-4 sm:py-2 rounded-xl bg-purple-500 text-white hover:bg-purple-700 transition text-xs xs:text-sm sm:text-base"
                                >
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
            <div className="content flex-1 w-full max-w-6xl relatsive rounded-lg">
                <div className="mb-6 gradient-bg relative w-full h-64 md:h-80 lg:h-96">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
                        <p className="text-xl xs:text-s md:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                            함께하는 무대, 함께하는 열정
                        </p>
                        <p className="text-lg xs:text-s md:text-2xl lg:text-3xl font-extrabold text-white mt-1 relative">
                            그루비맵에서 최고의 멤버를 찾아보세요.
                        </p>
                        <p className="lg:text-xl xs:text-s mt-3 font-medium">
                            밴드, 댄스 등 <span className="text-purple-600">다양한 분야</span>의 멤버를 찾아,
                            <br /> 함께 공연을 만들어보세요.
                        </p>
                    </div>
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="noise z-0">
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
                        <span className="text-purple-500">포트폴리오</span> 를 쌓으며 사람들과 교류하세요.
                    </p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            className={`button-custom transition-colors duration-300 py-2 px-4 rounded-lg shadow-md ${
                                activeButton === '공연/연습장소' ? 'bg-purple-500 text-white' : 'text-black'
                            }`}
                            onClick={() => handleButtonClick('공연/연습장소')}
                        >
                            공연/연습장소
                        </button>
                        <button
                            className={`button-custom transition-colors duration-300 py-2 px-4 rounded-lg shadow-md ${
                                activeButton === '프로필' ? 'bg-purple-500 text-white' : 'text-black'
                            }`}
                            onClick={() => handleButtonClick('프로필')}
                        >
                            프로필
                        </button>
                        <button
                            className={`button-custom transition-colors duration-300 py-2 px-4 rounded-lg shadow-md ${
                                activeButton === '팀원 모집' ? 'bg-purple-500 text-white' : 'text-black'
                            }`}
                            onClick={() => handleButtonClick('팀원 모집')}
                        >
                            팀원 모집
                        </button>
                        <button
                            className={`button-custom transition-colors duration-300 py-2 px-4 rounded-lg shadow-md ${
                                activeButton === '공연 홍보' ? 'bg-purple-500 text-white' : 'text-black'
                            }`}
                            onClick={() => handleButtonClick('공연 홍보')}
                        >
                            공연 홍보
                        </button>
                    </div>
                    <div className="mt-6 w-full flex justify-center">{renderContent()}</div>
                </div>
                <footer className="text-gray-500 py-4 w-full">
                    <div className="container mx-auto text-center">
                        <p className="text-sm">© 2024 GroovyMap. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </main>
    );
};

export default Home;
