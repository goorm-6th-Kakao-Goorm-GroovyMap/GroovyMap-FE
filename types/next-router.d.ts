import { NextRouter } from 'next/router';

declare module 'next/router' {
    export interface NextRouter {
        push(url: string, as?: string, options?: { shallow?: boolean }): Promise<boolean>;
    }
}
