export const regions = {
    ALL: 'ALL',
    GANGNAMGU: 'GANGNAMGU',
    GANGDONGGU: 'GANGDONGGU',
    GANGBUKGU: 'GANGBUKGU',
    GANGSEOGU: 'GANGSEOGU',
    GEUMCHEONGU: 'GEUMCHEONGU',
    GUROGU: 'GUROGU',
    DOBONGGU: 'DOBONGGU',
    DONGDAEMUNGU: 'DONGDAEMUNGU',
    DONGJAKGU: 'DONGJAKGU',
    MAPOGU: 'MAPOGU',
    SEODAEMUNGU: 'SEODAEMUNGU',
    SEOCHOGU: 'SEOCHOGU',
    SEONGDONGGU: 'SEONGDONGGU',
    SEONGBUKGU: 'SEONGBUKGU',
    SONGPA: 'SONGPA',
    YANGCHEONGU: 'YANGCHEONGU',
    YEONGDEUNGPOGU: 'YEONGDEUNGPOGU',
    YONGSANGU: 'YONGSANGU',
    EUNPYEONGGU: 'EUNPYEONGGU',
    JONGNOGU: 'JONGNOGU',
    JUNGGU: 'JUNGGU',
    JUNGNANGGU: 'JUNGNANGGU',
} as const;

export type Region = keyof typeof regions;

export const regionNames = {
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
    SONGPA: '송파구',
    YANGCHEONGU: '양천구',
    YEONGDEUNGPOGU: '영등포구',
    YONGSANGU: '용산구',
    EUNPYEONGGU: '은평구',
    JONGNOGU: '종로구',
    JUNGGU: '중구',
    JUNGNANGGU: '중랑구',
} as const;
