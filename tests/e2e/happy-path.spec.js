import { test, expect } from '@playwright/test';

test('Happy Path: Login, Create Task, and Complete', async ({ page }) => {
  // 1. Go to Login Page
  await page.goto('/login');
  
  // 2. Login (using a placeholder account, in real E2E you'd use a test account)
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // 3. Wait for Dashboard to load
  await expect(page).toHaveURL('/');
  await expect(page.locator('h2')).toContainText('Welcome back');
  
  // 4. Create a Task
  const taskTitle = `E2E Task ${Date.now()}`;
  await page.fill('input[placeholder="What needs to be done?..."]', taskTitle);
  await page.click('button:has-text("Add Task")');
  
  // 5. Verify task is in the list
  const taskItem = page.locator(`h3:has-text("${taskTitle}")`);
  await expect(taskItem).toBeVisible();
  
  // 6. Complete the task
  const completeButton = page.locator('button').filter({ has: page.locator('svg.text-slate-300') }).first();
  await completeButton.click();
  
  // 7. Verify task is completed (strikethrough)
  await expect(taskItem).toHaveClass(/line-through/);
});
