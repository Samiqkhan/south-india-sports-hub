import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

function parseDatabaseUrl(urlStr) {
  const parsed = new URL(urlStr);
  return {
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port, 10) : 3306,
    user: parsed.username,
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.substring(1) === 'sys' ? 'sih_db' : parsed.pathname.substring(1),
  };
}

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2'
  }
});

async function main() {
  const [rows] = await pool.query('SELECT * FROM scheduled_games');
  let updatedCount = 0;
  for (const row of rows) {
    if (row.round && (row.round.includes('Quarter Final') || row.round.includes('Semi Final'))) {
      if (row.round.startsWith('POOL ')) {
        let newRound = row.round;
        if (row.round.includes('Quarter Final')) newRound = 'Quarter Final';
        else if (row.round.includes('Semi Final')) newRound = 'Semi Final';
        
        console.log(`Updating id ${row.id} from "${row.round}" to "${newRound}"`);
        await pool.query('UPDATE scheduled_games SET round = ? WHERE id = ?', [newRound, row.id]);
        updatedCount++;
      }
    }
  }
  console.log(`Updated ${updatedCount} rows`);
  process.exit(0);
}

main().catch(console.error);
