export const translateRegion = (region: string): string => {
    const regions: { [key: string]: string } = {
        ALL: '전체',
        GANGNAMGU: '강남구',
        GANGDONGGU: '강동구',
        GANGBUKGU: '강북구',
        GANGSEOGU: '강서구',
        GEUMCHEONGU: '금천구',
        GUROGU: '구로구',
        DOBONGGU: '도봉구',
        DONGDAEMUNGU: '동대문구',
        DONGJAKGU: '동작구',
        MAPOGU: '마포구',
        SEODAEMUNGU: '서대문구',
        SEOCHOGU: '서초구',
        SEONGDONGGU: '성동구',
        SEONGBUKGU: '성북구',
        SONGPAGU: '송파구',
        YANGCHEONGU: '양천구',
        YEONGDEUNGPOGU: '영등포구',
        YONGSANGU: '용산구',
        EUNPYEONGGU: '은평구',
        JONGNOGU: '종로구',
        JUNGGU: '중구',
        JUNGNANGGU: '중랑구',
    };
    return regions[region] || region;
};

export const translatePart = (part: string): string => {
    const parts: { [key: string]: string } = {
        BAND: '밴드',
        VOCAL: '보컬',
        DANCE: '댄스',
    };
    return parts[part] || part;
};

export const translateType = (type: string): string => {
    const types: { [key: string]: string } = {
        GUITAR: '기타',
        DRUM: '드럼',
        BASSE: '베이스',
        VOCAL: '보컬',
        KEYBOARD: '건반',
        HIPHOP: '힙합',
        JAZZ: '재즈',
        ROCKING: '락킹',
        // 필요한 다른 타입 추가
    };
    return types[type] || type;
};
