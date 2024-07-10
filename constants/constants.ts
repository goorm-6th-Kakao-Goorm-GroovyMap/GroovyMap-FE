//지역구
export const areas: Record<string, { name: string; lat: number; lng: number }> = {
    ALL: { name: '서울 전체', lat: 37.5665, lng: 126.978 },
    YONGSANGU: { name: '용산구', lat: 37.5326, lng: 126.9906 },
    GANGNAMGU: { name: '강남구', lat: 37.4979, lng: 127.0276 },
    JONGNOGU: { name: '종로구', lat: 37.5729, lng: 126.9793 },
    GANGDONGGU: { name: '강동구', lat: 37.5301, lng: 127.1238 },
    GANGBUKGU: { name: '강북구', lat: 37.6396, lng: 127.0254 },
    GANGSEOGU: { name: '강서구', lat: 37.5509, lng: 126.8495 },
    GEUMCHEONGU: { name: '금천구', lat: 37.4569, lng: 126.8956 },
    GUROGU: { name: '구로구', lat: 37.4955, lng: 126.8874 },
    DOBONGGU: { name: '도봉구', lat: 37.6688, lng: 127.0468 },
    DONGDAEMUNGU: { name: '동대문구', lat: 37.5744, lng: 127.0396 },
    DONGJAKGU: { name: '동작구', lat: 37.5124, lng: 126.9392 },
    MAPOGU: { name: '마포구', lat: 37.5637, lng: 126.9084 },
    SEODAEMUNGU: { name: '서대문구', lat: 37.5791, lng: 126.9368 },
    SEOCHOGU: { name: '서초구', lat: 37.4836, lng: 127.0327 },
    SEONGDONGGU: { name: '성동구', lat: 37.5635, lng: 127.0364 },
    SEONGBUKGU: { name: '성북구', lat: 37.5894, lng: 127.0167 },
    SONGPAGU: { name: '송파구', lat: 37.5145, lng: 127.1067 },
    YANGCHEONGU: { name: '양천구', lat: 37.5244, lng: 126.8563 },
    YEONGDEUNGPOGU: { name: '영등포구', lat: 37.526, lng: 126.8963 },
    EUNPYEONGGU: { name: '은평구', lat: 37.6176, lng: 126.9227 },
    JUNGGU: { name: '중구', lat: 37.5633, lng: 126.9978 },
    JUNGNANGGU: { name: '중랑구', lat: 37.6063, lng: 127.0924 },
};

//분야, 분야별 타입 선택할떄 쓰기위해서 추가함
export const parts: Record<string, { name: string; types?: string[] }> = {
    ALL: { name: '전체', types: [] },
    VOCAL: { name: '노래', types: [] },
    BAND: { name: '밴드', types: ['GUITAR', 'KEYBOARD', 'BASS', 'VOCAL'] },
    DANCE: { name: '댄스', types: ['HIPHOP', 'JAZZ', 'LOCKING'] },
};

//분야별 파트타입 추가
export const types: Record<string, { name: string }> = {
    ALL: { name: '전체' },
    BAND: { name: '밴드' },
    VOCAL: { name: '보컬' },
    DANCE: { name: '춤' },
    GUITAR: { name: '기타' },
    DRUM: { name: '드럼' },
    BASS: { name: '베이스' },
    KEYBOARD: { name: '건반' },
    HIPHOP: { name: '힙합' },
    JAZZ: { name: '재즈' },
    LOCKING: { name: '락킹' },
    // 필요한 다른 타입 추가
};

export const markerImages: { [key in 'ALL' | 'BAND' | 'VOCAL' | 'DANCE']: string } = {
    ALL: '/band.svg',
    BAND: '/band.svg',
    VOCAL: '/singing.svg',
    DANCE: '/dance.svg',
};

export const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    return new Date(dateString).toLocaleString('ko-KR', options);
};
