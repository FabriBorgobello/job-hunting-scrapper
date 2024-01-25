import { GoogleSheetsClient } from '@/google';
import { getJDData, goToJobs, loginOtta, openChromium } from './utils';
import { env } from '@/envs';
import { JobDescription } from '@/types';

const Sheets = new GoogleSheetsClient(
  'src/google/credentials.json',
  env.SPREADSHEET_ID,
);

export async function ottaScrapper() {
  console.log('Starting Otta Scrapper');
  const { browser, page } = await openChromium();

  console.log('Logging in to Otta');
  await loginOtta(page);
  await goToJobs(page);

  console.log('Getting JDs');
  const JDs: JobDescription[] = [];
  while (!page.url().includes('batch-end')) {
    const jd = await getJDData(page);
    JDs.push(jd);
    await page.getByTestId('next-button').click();
    await page.waitForTimeout(1000);
  }

  console.log('Writing to Google Sheets');
  await Sheets.appendToSheetMultipleRows(env.SHEET_NAME, JDs);
  await browser.close();
  console.log('Done!');
}
