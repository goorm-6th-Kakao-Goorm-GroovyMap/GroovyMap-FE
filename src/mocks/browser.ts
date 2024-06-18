// src/mocks/browser.ts
import { setupWorker } from 'msw';
import { handlers } from './handler';

// 이 서비스 워커를 브라우저 환경에서 설정합니다.
export const worker = setupWorker(...handlers);

// 서비스 워커 시작 시 무시할 요청을 정의합니다.
worker.start({
    onUnhandledRequest: ({ method, url }) => {
        // Kakao API 요청을 무시
        if (url.href.startsWith('https://dapi.kakao.com')) {
            return 'bypass';
        }
        // 그 외의 요청을 경고로 표시
        console.warn(`[MSW] Warning: captured a request without a matching request handler: ${method} ${url}`);
    },
});
