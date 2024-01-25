import { Page, chromium } from '@playwright/test';
import { JobDescription, jobDescriptionSchema } from '@/types';
import { env } from '@/envs';

export async function openChromium() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  return { browser, page };
}

export async function loginOtta(page: Page) {
  await page.goto('https://app.otta.com/');
  await page.getByTestId('input-email').fill(env.OTTA_EMAIL);
  await page.getByTestId('input-password').fill(env.OTTA_PASSWORD);
  await page.waitForTimeout(1000);
  await page.getByTestId('login-button').click();
  await page.waitForTimeout(1000);
}

export async function goToJobs(page: Page) {
  await page.goto('https://app.otta.com/jobs');
  // await page.goto('https://app.otta.com/jobs?theme=take-another-look');
  // Close modal if it appears
  await page.waitForTimeout(1000);

  // Close the modal that asks for the user to download the app
  const modalClose = page.getByTestId('modal-remove-button');
  if (modalClose) await modalClose.click();

  // Close the modal that asks if you applied for the previous job
  const didYouApplyModal = await page
    .getByTestId('modal')
    .isVisible({ timeout: 3000 });
  if (didYouApplyModal) await page.getByRole('button', { name: 'No' }).click();
}

export async function getJDData(page: Page) {
  const titleAndCompany = await page.getByTestId('job-title').textContent();
  const title = titleAndCompany?.split(', ')[0];
  const company = titleAndCompany?.split(', ')[1];

  const jobSection = page.getByTestId('job-section');
  const salaryRange = await jobSection
    .getByTestId('salary-section')
    .textContent();
  const techStack = await jobSection
    .getByTestId('job-technology-used')
    .textContent();

  const seniority = await jobSection
    .getByTestId('experience-section')
    .textContent();
  const location = (
    await jobSection.getByTestId('job-location-tag').allTextContents()
  ).join(', ');
  const linkedInHR = company
    ? `https://www.linkedin.com/company/${company
        .toLowerCase()
        .replace(/\s/g, '')}/people/?facetCurrentFunction=12`
    : null;

  const ottaLink = page.url();

  const jd = jobDescriptionSchema.parse({
    company,
    title,
    techStack,
    salaryRange,
    seniority,
    location,
    ottaLink,
    linkedInHR,
  });

  return jd;
}
