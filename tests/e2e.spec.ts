import { test, expect } from '@playwright/test';

test.describe('SNUClinicSystem E2E Tests', () => {
    test('should load the home page', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/강아지 EMR 헬스 대시보드/);
        // The title is split into two elements
        await expect(page.getByText('SNU 반려동물')).toBeVisible();
        await expect(page.getByText('검진센터 EMR')).toBeVisible();
    });

    test('should navigate to patient management and view patient details', async ({ page }) => {
        await page.goto('/');

        // Click on "환자 관리" in sidebar
        await page.getByRole('link', { name: '환자 관리' }).click();
        // Use heading role to avoid ambiguity with sidebar link
        await expect(page.getByRole('heading', { name: '환자 관리' })).toBeVisible();

        // Click on the first patient row in the table (List view is default)
        await page.locator('tbody tr').first().click();

        // Wait for the sheet/dialog to appear
        await expect(page.getByRole('dialog')).toBeVisible();

        // Click "상세 정보 보기"
        await page.getByRole('button', { name: '상세 정보 보기' }).click();

        // Verify we are on the patient detail page
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('should verify advanced analytics tab', async ({ page }) => {
        // Navigate directly to a patient detail page (assuming ID 1 exists or using the first one found)
        await page.goto('/patients');
        await page.locator('tbody tr').first().click();
        await page.getByRole('button', { name: '상세 정보 보기' }).click();

        // Click on "고급 분석" tab
        await page.getByRole('tab', { name: '고급 분석' }).click();

        // Verify charts are present
        await expect(page.getByText('주요 검사 수치 및 약물 타임라인')).toBeVisible();
        await expect(page.getByText('약물 처방 이력')).toBeVisible();
    });
});
