import { google, sheets_v4 } from 'googleapis';
import { readFileSync } from 'fs';

export class GoogleSheetsClient {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;

  constructor(credentialsPath: string, spreadsheetId: string) {
    this.spreadsheetId = spreadsheetId;

    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf-8'));
    const client = new google.auth.JWT(credentials.client_email, undefined, credentials.private_key, [
      'https://www.googleapis.com/auth/spreadsheets',
    ]);

    this.sheets = google.sheets({ version: 'v4', auth: client });
  }

  private async findFirstEmptyRow(sheetName: string): Promise<number> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A:A`,
    });

    const values = res.data.values;
    if (!values || values.length === 0) {
      return 1; // Sheet is empty, start at the first row
    }
    return values.length + 1; // Return the row number after the last non-empty row
  }

  async appendToSheet<T extends { [key: string]: any }>(sheetName: string, data: T): Promise<void> {
    const firstEmptyRow = await this.findFirstEmptyRow(sheetName);
    const range = `${sheetName}!A${firstEmptyRow}`;

    const values = [Object.values(data)];

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  }

  async appendToSheetMultipleRows<T extends { [key: string]: any }>(sheetName: string, data: T[]): Promise<void> {
    const firstEmptyRow = await this.findFirstEmptyRow(sheetName);
    const range = `${sheetName}!A${firstEmptyRow}`;

    // Map each object in the array to an array of its values
    const values = data.map(Object.values);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  }
}
