import 'dotenv/config';
import { ottaScrapper } from './otta';

async function main() {
  await ottaScrapper();
}

main();
