import { DateTime } from 'luxon';

export interface Comment {
    id: number;
    author: string;
    content: string;
    date: DateTime;
}

export interface Post {
    id: number;
    title: string;
    author: string;
    content: string;
    date: DateTime;
    views: number;
    field: string;
    position: string;
    region: string;
    recruit_num: number;
}

export interface Location {
    lat: number;
    lng: number;
    name: string;
}

export interface FieldPositionMapping {
    [field: string]: string[];
}
export const FieldPositionMapping: FieldPositionMapping = {
    BAND: ['기타', '베이스', '드럼', '보컬', '키보드'],
    DANCE: ['힙합', '팝핑', '브레이킹', '기타(ETC)'],
    VOCAL: ['힙합', '재즈', '발라드', '기타(ETC)'],
};
export const regionCenters: { [key: string]: { name: string; lat: number; lng: number } } = {
    SEOUL: { name: '서울 전체', lat: 37.5665, lng: 126.978 },
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
