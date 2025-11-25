/**
 * 중앙화된 설정 관리
 * 환경 변수 및 애플리케이션 설정을 관리합니다.
 */

export interface AppConfig {
    port: number;
    nodeEnv: string;
    isDevelopment: boolean;
    isProduction: boolean;
    cors: {
        enabled: boolean;
        origin?: string;
    };
    database: {
        url?: string;
    };
}

/**
 * 환경 변수에서 설정을 로드합니다.
 */
export function loadConfig(): AppConfig {
    const nodeEnv = process.env.NODE_ENV || 'development';

    return {
        port: parseInt(process.env.PORT || '5000', 10),
        nodeEnv,
        isDevelopment: nodeEnv === 'development',
        isProduction: nodeEnv === 'production',
        cors: {
            enabled: true,
            origin: process.env.CORS_ORIGIN,
        },
        database: {
            url: process.env.DATABASE_URL,
        },
    };
}

export const config = loadConfig();
