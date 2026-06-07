import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Helper to parse MySQL DATABASE_URL
function parseDatabaseUrl(urlStr) {
  if (!urlStr) {
    throw new Error("DATABASE_URL environment variable is missing");
  }
  const parsed = new URL(urlStr);
  return {
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port, 10) : 3306,
    user: parsed.username,
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.substring(1), // remove leading slash
  };
}

let pool;

const connectAndMigrate = async () => {
  try {
    const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
    const targetDatabase = dbConfig.database === 'sys' ? 'sih_db' : dbConfig.database;

    console.log(`Checking/Creating database '${targetDatabase}' on TiDB Cloud...`);
    
    // Connect temporarily to run CREATE DATABASE
    const tempPool = mysql.createPool({
      ...dbConfig,
      database: 'sys',
      ssl: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      }
    });

    await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${targetDatabase}\``);
    await tempPool.end();
    console.log(`Database '${targetDatabase}' ready.`);

    // Create the actual connection pool targeting 'sih_db'
    pool = mysql.createPool({
      ...dbConfig,
      database: targetDatabase,
      ssl: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log(`TiDB connection pool established for database: ${targetDatabase}`);

    // Run table migrations & seeding
    await initDb();
  } catch (err) {
    console.error("Database connection or migration failed:", err.message);
  }
};

// Check database connection and run schema migrations
const initDb = async () => {
  if (!pool) {
    console.error("Skipping migrations: database pool is not initialized.");
    return;
  }

  try {
    console.log("Checking and initializing TiDB database tables...");
    
    // Create Player Registrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS player_registrations (
        id VARCHAR(50) PRIMARY KEY,
        playerName VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        ageCategory VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        partnerName VARCHAR(100),
        tournamentTitle VARCHAR(150) NOT NULL,
        amountPaid VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        date VARCHAR(50) NOT NULL,
        screenshotUrl LONGTEXT
      )
    `);

    try {
      await pool.query('ALTER TABLE player_registrations ADD COLUMN screenshotUrl LONGTEXT');
      console.log("Migration: Added screenshotUrl column to player_registrations table successfully.");
    } catch (e) {
      // Column already exists, ignore
    }

    // Create Tournament Applications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tournament_applications (
        id VARCHAR(50) PRIMARY KEY,
        organizerName VARCHAR(150) NOT NULL,
        tournamentTitle VARCHAR(150) NOT NULL,
        sport VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        expectedDates VARCHAR(150) NOT NULL,
        expectedTeams VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        details TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        date VARCHAR(50) NOT NULL
      )
    `);

    // Create Sponsor Registrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sponsor_registrations (
        id VARCHAR(50) PRIMARY KEY,
        companyName VARCHAR(150) NOT NULL,
        contactPerson VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        state VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        sponsorshipLevel VARCHAR(100) NOT NULL,
        interestedTournaments VARCHAR(250) NOT NULL,
        message TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'New',
        date VARCHAR(50) NOT NULL
      )
    `);

    // Create Game Fees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_fees (
        id VARCHAR(50) PRIMARY KEY,
        tournamentSlug VARCHAR(150) NOT NULL,
        ageCategory VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        fee VARCHAR(50) NOT NULL
      )
    `);

    // Create Payment Config table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_config (
        id VARCHAR(50) PRIMARY KEY,
        useRazorpay TINYINT(1) NOT NULL DEFAULT 0,
        upiId VARCHAR(255) NOT NULL,
        qrCodeUrl LONGTEXT,
        razorpayKeyId VARCHAR(255),
        razorpayKeySecret VARCHAR(255)
      )
    `);

    // Seed default payment config if empty
    const [configs] = await pool.query("SELECT COUNT(*) as count FROM payment_config");
    if (configs[0].count === 0) {
      console.log("Seeding initial default payment configuration...");
      await pool.query(`
        INSERT INTO payment_config (id, useRazorpay, upiId, qrCodeUrl, razorpayKeyId, razorpayKeySecret)
        VALUES ('current', ?, ?, NULL, ?, ?)
      `, [
        process.env.USE_RAZORPAY === 'true' ? 1 : 0,
        process.env.UPI_ID || 'vigneshvicky87302@oksbi',
        process.env.RAZORPAY_KEY_ID || 'rzp_test_Ssqkj7T7DivUDd',
        process.env.RAZORPAY_KEY_SECRET || 'MgmaWgJ3niZglmQ3Q338DuQ7'
      ]);
    }

    console.log("Database tables checked/created successfully.");

    // Clean up initial mock data if they exist, so the user starts fresh
    await pool.query("DELETE FROM player_registrations WHERE id IN ('pr-1', 'pr-2', 'pr-3', 'pr-4')");
    await pool.query("DELETE FROM tournament_applications WHERE id IN ('ta-1', 'ta-2')");
    await pool.query("DELETE FROM sponsor_registrations WHERE id IN ('sr-1', 'sr-2')");

    const [feesCount] = await pool.query('SELECT COUNT(*) as count FROM game_fees');
    if (feesCount[0].count === 0) {
      console.log("Seeding initial mock game fees...");
      const seedFees = [
        ['gf-1', 'chess-tournament-2026', 'U-9', 'Girls & Boys Mixed', '₹400'],
        ['gf-2', 'chess-tournament-2026', 'U-12', 'Girls & Boys Mixed', '₹400'],
        ['gf-3', 'chess-tournament-2026', 'U-15', 'Girls & Boys Mixed', '₹400'],
        ['gf-4', 'chess-tournament-2026', 'Open', 'Girls & Boys Mixed', '₹400'],
        ['gf-b1', 'tamilnadu-badminton-tournament-2026', 'U-9', 'Girls Singles', '₹400'],
        ['gf-b2', 'tamilnadu-badminton-tournament-2026', 'U-11', 'Girls Singles', '₹400'],
        ['gf-b3', 'tamilnadu-badminton-tournament-2026', 'U-13', 'Girls Singles', '₹400'],
        ['gf-b4', 'tamilnadu-badminton-tournament-2026', 'U-15', 'Girls Singles', '₹400'],
        ['gf-b5', 'tamilnadu-badminton-tournament-2026', 'U-7', 'Boys Singles', '₹400'],
        ['gf-b6', 'tamilnadu-badminton-tournament-2026', 'U-9', 'Boys Singles', '₹400'],
        ['gf-b7', 'tamilnadu-badminton-tournament-2026', 'U-11', 'Boys Singles', '₹400'],
        ['gf-b8', 'tamilnadu-badminton-tournament-2026', 'U-13', 'Boys Singles', '₹400'],
        ['gf-b9', 'tamilnadu-badminton-tournament-2026', 'U-15', 'Boys Singles', '₹400'],
        ['gf-b10', 'tamilnadu-badminton-tournament-2026', 'Open', 'Boys Open Singles', '₹400']
      ];
      for (const f of seedFees) {
        await pool.query(`
          INSERT INTO game_fees 
          (id, tournamentSlug, ageCategory, category, fee) 
          VALUES (?, ?, ?, ?, ?)
        `, f);
      }
    } else {
      // Check if badminton fees specifically are missing, if so, seed them
      const [badmintonFees] = await pool.query("SELECT COUNT(*) as count FROM game_fees WHERE tournamentSlug = 'tamilnadu-badminton-tournament-2026'");
      if (badmintonFees[0].count === 0) {
        console.log("Seeding badminton game fees...");
        const badmintonSeed = [
          ['gf-b1', 'tamilnadu-badminton-tournament-2026', 'U-9', 'Girls Singles', '₹400'],
          ['gf-b2', 'tamilnadu-badminton-tournament-2026', 'U-11', 'Girls Singles', '₹400'],
          ['gf-b3', 'tamilnadu-badminton-tournament-2026', 'U-13', 'Girls Singles', '₹400'],
          ['gf-b4', 'tamilnadu-badminton-tournament-2026', 'U-15', 'Girls Singles', '₹400'],
          ['gf-b5', 'tamilnadu-badminton-tournament-2026', 'U-7', 'Boys Singles', '₹400'],
          ['gf-b6', 'tamilnadu-badminton-tournament-2026', 'U-9', 'Boys Singles', '₹400'],
          ['gf-b7', 'tamilnadu-badminton-tournament-2026', 'U-11', 'Boys Singles', '₹400'],
          ['gf-b8', 'tamilnadu-badminton-tournament-2026', 'U-13', 'Boys Singles', '₹400'],
          ['gf-b9', 'tamilnadu-badminton-tournament-2026', 'U-15', 'Boys Singles', '₹400'],
          ['gf-b10', 'tamilnadu-badminton-tournament-2026', 'Open', 'Boys Open Singles', '₹400']
        ];
        for (const f of badmintonSeed) {
          await pool.query(`
            INSERT INTO game_fees 
            (id, tournamentSlug, ageCategory, category, fee) 
            VALUES (?, ?, ?, ?, ?)
          `, f);
        }
      }
    }
  } catch (error) {
    console.error("Failed to run DDL migrations or seed mock data:", error);
  }
};

// --- API ROUTES ---

// Middleware to check pool status
const requireDb = (req, res, next) => {
  if (!pool) {
    return res.status(503).json({ error: "Database not connected. Please configure your .env file with a valid TiDB Cloud DATABASE_URL." });
  }
  next();
};

// 1. Players Endpoints
app.get('/api/players', requireDb, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM player_registrations ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/players', requireDb, async (req, res) => {
  const { playerName, phone, email, state, city, ageCategory, category, partnerName, tournamentTitle, amountPaid, status, screenshotUrl } = req.body;
  const id = `pr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const date = new Date().toISOString();

  try {
    await pool.query(`
      INSERT INTO player_registrations 
      (id, playerName, phone, email, state, city, ageCategory, category, partnerName, tournamentTitle, amountPaid, status, date, screenshotUrl) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, playerName, phone, email, state, city, ageCategory, category, partnerName || null, tournamentTitle, amountPaid, status || 'Pending', date, screenshotUrl || null]);
    
    res.status(201).json({ id, playerName, phone, email, state, city, ageCategory, category, partnerName, tournamentTitle, amountPaid, status: status || 'Pending', date, screenshotUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/players/:id/status', requireDb, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE player_registrations SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/players/:id', requireDb, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM player_registrations WHERE id = ?', [id]);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Tournaments Endpoints
app.get('/api/tournaments', requireDb, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tournament_applications ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tournaments', requireDb, async (req, res) => {
  const { organizerName, tournamentTitle, sport, state, city, expectedDates, expectedTeams, email, phone, details } = req.body;
  const id = `ta-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const date = new Date().toISOString();

  try {
    await pool.query(`
      INSERT INTO tournament_applications 
      (id, organizerName, tournamentTitle, sport, state, city, expectedDates, expectedTeams, email, phone, details, status, date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, organizerName, tournamentTitle, sport, state, city, expectedDates, expectedTeams, email, phone, details || null, 'Pending', date]);
    
    res.status(201).json({ id, organizerName, tournamentTitle, sport, state, city, expectedDates, expectedTeams, email, phone, details, status: 'Pending', date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tournaments/:id/status', requireDb, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE tournament_applications SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tournaments/:id', requireDb, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tournament_applications WHERE id = ?', [id]);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Sponsors Endpoints
app.get('/api/sponsors', requireDb, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sponsor_registrations ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sponsors', requireDb, async (req, res) => {
  const { companyName, contactPerson, email, phone, state, city, sponsorshipLevel, interestedTournaments, message } = req.body;
  const id = `sr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const date = new Date().toISOString();

  try {
    await pool.query(`
      INSERT INTO sponsor_registrations 
      (id, companyName, contactPerson, email, phone, state, city, sponsorshipLevel, interestedTournaments, message, status, date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, companyName, contactPerson, email, phone, state, city, sponsorshipLevel, interestedTournaments, message || null, 'New', date]);
    
    res.status(201).json({ id, companyName, contactPerson, email, phone, state, city, sponsorshipLevel, interestedTournaments, message, status: 'New', date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/sponsors/:id/status', requireDb, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE sponsor_registrations SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/sponsors/:id', requireDb, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM sponsor_registrations WHERE id = ?', [id]);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- RAZORPAY PAYMENT ENDPOINTS ---

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_Ssqkj7T7DivUDd',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'MgmaWgJ3niZglmQ3Q338DuQ7'
});

// Helper to get active payment config
async function getActivePaymentConfig() {
  try {
    const [rows] = await pool.query("SELECT * FROM payment_config WHERE id = 'current'");
    if (rows.length > 0) {
      return {
        useRazorpay: rows[0].useRazorpay === 1,
        upiId: rows[0].upiId,
        qrCodeUrl: rows[0].qrCodeUrl,
        razorpayKeyId: rows[0].razorpayKeyId || process.env.RAZORPAY_KEY_ID || 'rzp_test_Ssqkj7T7DivUDd',
        razorpayKeySecret: rows[0].razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET || 'MgmaWgJ3niZglmQ3Q338DuQ7'
      };
    }
  } catch (e) {
    console.error("Error fetching config from DB, falling back to process.env", e);
  }
  return {
    useRazorpay: process.env.USE_RAZORPAY === 'true',
    upiId: process.env.UPI_ID || 'vigneshvicky87302@oksbi',
    qrCodeUrl: null,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_Ssqkj7T7DivUDd',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'MgmaWgJ3niZglmQ3Q338DuQ7'
  };
}

app.post('/api/payments/create-order', async (req, res) => {
  const { amount } = req.body; // in paise
  try {
    const config = await getActivePaymentConfig();
    const dynamicRazorpay = new Razorpay({
      key_id: config.razorpayKeyId,
      key_secret: config.razorpayKeySecret
    });
    const options = {
      amount: parseInt(amount, 10),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    const order = await dynamicRazorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payments/verify', requireDb, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationData } = req.body;

  try {
    const config = await getActivePaymentConfig();
    // Generate signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", config.razorpayKeySecret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: "Invalid payment signature verification failed." });
    }

    // Save registration to database
    const { playerName, phone, email, state, city, ageCategory, category, partnerName, tournamentTitle, amountPaid } = registrationData;
    const id = `pr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const date = new Date().toISOString();

    await pool.query(`
      INSERT INTO player_registrations 
      (id, playerName, phone, email, state, city, ageCategory, category, partnerName, tournamentTitle, amountPaid, status, date, screenshotUrl) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, playerName, phone, email, state, city, ageCategory, category, partnerName || null, tournamentTitle, amountPaid, 'Paid', date, null]);

    res.json({ success: true, message: "Payment verified and registration recorded successfully.", id });
  } catch (error) {
    console.error("Payment verification or DB insertion failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- RAZORPAY & UPI CONFIG ENDPOINTS ---
app.get('/api/payments/config', async (req, res) => {
  try {
    const config = await getActivePaymentConfig();
    res.json({
      useRazorpay: config.useRazorpay,
      upiId: config.upiId,
      qrCodeUrl: config.qrCodeUrl,
      razorpayKeyId: config.razorpayKeyId,
      razorpayKeySecret: config.razorpayKeySecret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payments/config', requireDb, async (req, res) => {
  const { useRazorpay, upiId, qrCodeUrl, razorpayKeyId, razorpayKeySecret } = req.body;
  try {
    await pool.query(`
      INSERT INTO payment_config (id, useRazorpay, upiId, qrCodeUrl, razorpayKeyId, razorpayKeySecret)
      VALUES ('current', ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        useRazorpay = VALUES(useRazorpay),
        upiId = VALUES(upiId),
        qrCodeUrl = VALUES(qrCodeUrl),
        razorpayKeyId = VALUES(razorpayKeyId),
        razorpayKeySecret = VALUES(razorpayKeySecret)
    `, [useRazorpay ? 1 : 0, upiId, qrCodeUrl || null, razorpayKeyId || null, razorpayKeySecret || null]);
    res.json({ success: true, message: "Payment configuration updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Game Fees Endpoints
app.get('/api/game-fees', requireDb, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM game_fees ORDER BY tournamentSlug, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/game-fees/:id', requireDb, async (req, res) => {
  const { id } = req.params;
  const { fee } = req.body;
  try {
    await pool.query('UPDATE game_fees SET fee = ? WHERE id = ?', [fee, id]);
    res.json({ success: true, id, fee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Debug Database Operations
app.post('/api/db/reset', requireDb, async (req, res) => {
  try {
    await pool.query('DROP TABLE IF EXISTS player_registrations');
    await pool.query('DROP TABLE IF EXISTS tournament_applications');
    await pool.query('DROP TABLE IF EXISTS sponsor_registrations');
    await pool.query('DROP TABLE IF EXISTS game_fees');
    await pool.query('DROP TABLE IF EXISTS payment_config');
    await initDb();
    res.json({ success: true, message: "Database reinitialized and seeded." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/db/clear', requireDb, async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE player_registrations');
    await pool.query('TRUNCATE TABLE tournament_applications');
    await pool.query('TRUNCATE TABLE sponsor_registrations');
    await pool.query('TRUNCATE TABLE game_fees');
    res.json({ success: true, message: "Database cleared." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend build in production
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Express
app.listen(PORT, async () => {
  console.log(`Express server listening on port ${PORT}`);
  await connectAndMigrate();
});
