/**
 * 클라이언트 전용 타입 정의
 */

import type { Patient, Visit, TestResult, ExamMaster } from '@shared/schema';

/**
 * API 응답 타입
 */
export interface ApiResponse<T> {
    data: T;
    error?: string;
}

/**
 * 페이지네이션 타입
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

/**
 * 필터 옵션
 */
export interface FilterOptions {
    breed?: string;
    ageMin?: number;
    ageMax?: number;
    gender?: string;
    neutered?: boolean;
}

/**
 * 정렬 옵션
 */
export interface SortOptions {
    field: string;
    direction: 'asc' | 'desc';
}

/**
 * 검사 결과와 검사 항목 정보를 포함한 타입
 */
export interface TestResultWithExam extends TestResult {
    exam?: ExamMaster;
}

/**
 * 환자 통계 정보
 */
export interface PatientStats {
    totalPatients: number;
    totalVisits: number;
    totalTests: number;
    abnormalTests: number;
}

/**
 * 방문 통계
 */
export interface VisitStats {
    totalVisits: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
}

/**
 * 차트 데이터 포인트
 */
export interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
}

/**
 * 건강 레이더 차트 데이터
 */
export interface HealthRadarData {
    category: string;
    value: number;
    fullMark: number;
}
