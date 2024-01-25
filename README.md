# Job Hunting Scrapper

## Overview

Job Hunting Scrapper is a node.js application designed to automate the process of scraping job listings from [Otta](https://app.otta.com/) and writing them to a Google Sheet. This application utilizes Playwright for web scraping and the Google Sheets API for data storage.

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory and add the following variables:

```bash
SPREADSHEET_ID=
SHEET_NAME=
OTTA_EMAIL=
OTTA_PASSWORD=
```

4. Add the Google Sheets API credentials in a file named `credentials.json` in the `src/google` directory
5. Run the application with `npm start`

> NOTE: More information on setting up the Google Sheets API can be found [here](https://developers.google.com/sheets/api/quickstart/nodejs)
