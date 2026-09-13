import { test, expect, Page } from '@playwright/test';

// Seeded by backend/prisma/seed.ts on a freshly migrated DB (npx prisma migrate deploy && npx prisma db seed).
// Position 1 ("Senior Full-Stack Engineer") has 3 interview steps and 3 candidates:
//   - Carlos García  -> candidateId 3, applicationId 4, step "Initial Screening"  (id 1)
//   - John Doe       -> candidateId 1, applicationId 1, step "Technical Interview" (id 2)
//   - Jane Smith     -> candidateId 2, applicationId 3, step "Technical Interview" (id 2)
const POSITION_ID = 1;
const POSITION_TITLE = 'Senior Full-Stack Engineer';

const CARLOS = { candidateId: 3, applicationId: 4, name: 'Carlos García' };

const STEP = {
    initialScreening: { id: 1, testid: 'phase-column-initial-screening' },
    technicalInterview: { id: 2, testid: 'phase-column-technical-interview' },
    managerInterview: { id: 3, testid: 'phase-column-manager-interview' },
};

// react-beautiful-dnd ignores a single mouse.move/up pair: it needs an initial
// small move past a drag threshold, then a paced move into the target with
// intermediate steps, before it will register the drop.
async function dragCandidateToColumn(page: Page, cardTestId: string, columnTestId: string) {
    const card = page.getByTestId(cardTestId);
    const column = page.getByTestId(columnTestId);

    const cardBox = await card.boundingBox();
    const columnBox = await column.boundingBox();
    if (!cardBox || !columnBox) {
        throw new Error('Could not measure drag source/target');
    }

    const startX = cardBox.x + cardBox.width / 2;
    const startY = cardBox.y + cardBox.height / 2;
    const endX = columnBox.x + columnBox.width / 2;
    const endY = columnBox.y + columnBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 10, startY + 5, { steps: 5 });
    await page.waitForTimeout(150);
    await page.mouse.move(endX, endY, { steps: 20 });
    await page.waitForTimeout(150);
    await page.mouse.up();
}

test.describe('Position kanban board', () => {
    test('loads the position with its phase columns and candidates in the right column', async ({ page }) => {
        await page.goto(`/positions/${POSITION_ID}`);

        await expect(page.getByTestId('position-title')).toHaveText(POSITION_TITLE);

        const initialScreeningColumn = page.getByTestId(STEP.initialScreening.testid);
        const technicalInterviewColumn = page.getByTestId(STEP.technicalInterview.testid);
        const managerInterviewColumn = page.getByTestId(STEP.managerInterview.testid);

        await expect(initialScreeningColumn).toBeVisible();
        await expect(technicalInterviewColumn).toBeVisible();
        await expect(managerInterviewColumn).toBeVisible();

        await expect(initialScreeningColumn.getByTestId('candidate-card-3')).toContainText('Carlos García');
        await expect(technicalInterviewColumn.getByTestId('candidate-card-1')).toContainText('John Doe');
        await expect(technicalInterviewColumn.getByTestId('candidate-card-2')).toContainText('Jane Smith');

        // Each candidate must appear in exactly one column.
        await expect(technicalInterviewColumn.getByTestId('candidate-card-3')).toHaveCount(0);
        await expect(managerInterviewColumn.getByTestId('candidate-card-1')).toHaveCount(0);
    });

    test('dragging a candidate card to another phase persists the new stage', async ({ page, request }) => {
        await page.goto(`/positions/${POSITION_ID}`);

        const cardTestId = `candidate-card-${CARLOS.candidateId}`;
        const initialScreeningColumn = page.getByTestId(STEP.initialScreening.testid);
        const technicalInterviewColumn = page.getByTestId(STEP.technicalInterview.testid);

        await expect(initialScreeningColumn.getByTestId(cardTestId)).toBeVisible();

        const [putRequest] = await Promise.all([
            page.waitForResponse(
                (response) =>
                    response.url().includes(`/candidates/${CARLOS.candidateId}`) &&
                    response.request().method() === 'PUT'
            ),
            dragCandidateToColumn(page, cardTestId, STEP.technicalInterview.testid),
        ]);

        expect(putRequest.ok()).toBeTruthy();
        expect(putRequest.request().postDataJSON()).toEqual({
            applicationId: CARLOS.applicationId,
            currentInterviewStep: STEP.technicalInterview.id,
        });

        await expect(technicalInterviewColumn.getByTestId(cardTestId)).toBeVisible();
        await expect(initialScreeningColumn.getByTestId(cardTestId)).toHaveCount(0);

        // Restore the seeded state so the test suite can be re-run without drift.
        const revert = await request.put(`http://localhost:3010/candidates/${CARLOS.candidateId}`, {
            data: {
                applicationId: CARLOS.applicationId,
                currentInterviewStep: STEP.initialScreening.id,
            },
        });
        expect(revert.ok()).toBeTruthy();
    });
});
