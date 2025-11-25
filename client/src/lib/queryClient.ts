import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";

/**
 * React Query 클라이언트 설정
 * 전역 에러 핸들링 및 캐싱 전략을 정의합니다.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 쿼리 기본 설정
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (이전 cacheTime)
      retry: (failureCount, error) => {
        // ApiError의 경우 상태 코드에 따라 재시도 결정
        if (error instanceof ApiError) {
          // 4xx 에러는 재시도하지 않음
          if (error.status >= 400 && error.status < 500) {
            return false;
          }
        }
        // 최대 3번까지 재시도
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // 뮤테이션 기본 설정
      retry: false,
      onError: (error) => {
        console.error('Mutation error:', error);
        // 여기에 토스트 알림 등을 추가할 수 있습니다
      },
    },
  },
});

/**
 * 쿼리 키 팩토리
 * 일관된 쿼리 키 생성을 위한 헬퍼
 */
export const queryKeys = {
  patients: {
    all: ['patients'] as const,
    detail: (animalNumber: string) => ['patients', animalNumber] as const,
  },
  visits: {
    all: ['visits'] as const,
    byPatient: (animalNumber: string) => ['visits', 'patient', animalNumber] as const,
  },
  testResults: {
    all: ['testResults'] as const,
    byPatient: (animalNumber: string) => ['testResults', 'patient', animalNumber] as const,
  },
  examMaster: {
    all: ['examMaster'] as const,
  },
  questionnaire: {
    templates: ['questionnaire', 'templates'] as const,
    responses: ['questionnaire', 'responses'] as const,
    byPatient: (animalNumber: string) => ['questionnaire', 'responses', animalNumber] as const,
  },
  filters: {
    all: ['filters'] as const,
  },
  clusters: {
    all: ['clusters'] as const,
  },
  medications: {
    all: ['medications'] as const,
    byPatient: (animalNumber: string) => ['medications', 'patient', animalNumber] as const,
  },
};
