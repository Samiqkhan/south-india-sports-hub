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
app.use(express.json());

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
        status VARCHAR(50) NOT NULL DEFAULT 'Paid',
        date VARCHAR(50) NOT NULL
      )
    `);

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

    console.log("Database tables checked/created successfully.");

    // Seed mock data if tables are empty
    const [players] = await pool.query('SELECT COUNT(*) as count FROM player_registrations');
    if (players[0].count === 0) {
      console.log("Seeding initial mock players...");
      const seedPlayers = [
        ['pr-1', 'Karthik Raja', '+91 94432 10987', 'karthik.raja@gmail.com', 'Tamil Nadu', 'Chennai', 'U-15', 'Girls & Boys Mixed', null, 'Chess Tournament 2026', '₹400', 'Paid', '2026-05-20T10:30:00Z'],
        ['pr-2', 'Anjali Sharma', '+91 98450 12345', 'anjali.sharma@hotmail.com', 'Karnataka', 'Bengaluru', 'U-12', 'Girls & Boys Mixed', null, 'Chess Tournament 2026', '₹400', 'Paid', '2026-05-21T14:45:00Z'],
        ['pr-3', 'Devendra Rao', '+91 87654 32109', 'dev.rao@yahoo.com', 'Andhra Pradesh', 'Vijayawada', 'Open', 'Girls & Boys Mixed', null, 'Chess Tournament 2026', '₹400', 'Paid', '2026-05-22T09:15:00Z'],
        ['pr-4', 'Nithin Reddy', '+91 99887 76655', 'nithin.r@outlook.com', 'Telangana', 'Hyderabad', 'U-9', 'Girls & Boys Mixed', null, 'Chess Tournament 2026', '₹400', 'Pending', '2026-05-23T11:00:00Z']
      ];
      for (const p of seedPlayers) {
        await pool.query(`
          INSERT INTO player_registrations 
          (id, playerName, phone, email, state, city, ageCategory, category, partnerName, tournamentTitle, amountPaid, status, date) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, p);
      }
    }

    const [tournaments] = await pool.query('SELECT COUNT(*) as count FROM tournament_applications');
    if (tournaments[0].count === 0) {
      console.log("Seeding initial mock tournaments...");
      const seedTournaments = [
        ['ta-1', 'Smashers Badminton Club', 'Madurai Badminton Championship 2026', 'Badminton', 'Tamil Nadu', 'Madurai', 'July 15-18, 2026', '150 - 300', 'events@smashersclub.com', '+91 91234 56789', 'We want to organize an inter-club badminton tournament with singles and doubles categories for U-17 and Adults. We need platform registration support and scheduling tools.', 'Approved', '2026-05-18T08:00:00Z'],
        ['ta-2', 'Net Raiders Academy', 'Deccan Volleyball Cup 2026', 'Other', 'Telangana', 'Hyderabad', 'August 12-14, 2026', '50 - 150', 'info@netraiders.org', '+91 88776 65544', 'Looking to organize a state-wide volleyball tournament. SISA is a key venue partner we want to collaborate with.', 'Pending', '2026-05-22T16:20:00Z']
      ];
      for (const t of seedTournaments) {
        await pool.query(`
          INSERT INTO tournament_applications 
          (id, organizerName, tournamentTitle, sport, state, city, expectedDates, expectedTeams, email, phone, details, status, date) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, t);
      }
    }

    const [sponsors] = await pool.query('SELECT COUNT(*) as count FROM sponsor_registrations');
    if (sponsors[0].count === 0) {
      console.log("Seeding initial mock sponsors...");
      const seedSponsors = [
        ['sr-1', 'Decathlon Sports India', 'Priya Patel', 'priya.patel@decathlon.in', '+91 99001 12233', 'Karnataka', 'Bengaluru', 'Title Sponsor', 'Chess Tournament 2026, All Upcoming Events', 'We are interested in being the official equipment and title partner. We can offer ₹50,000 cash sponsorship plus gift vouchers worth ₹20,000 for top category winners.', 'Partnership Active', '2026-05-19T11:40:00Z'],
        ['sr-2', 'Boost Energy Drinks', 'Rahul Nair', 'rahul.nair@boost.co.in', '+91 97788 88999', 'Kerala', 'Kochi', 'Equipment Partner', 'All Sports Hub Tournaments', 'We want to set up boost refreshment booths at tournament venues and provide free energy drinks to participants.', 'Contacted', '2026-05-21T10:10:00Z']
      ];
      for (const s of seedSponsors) {
        await pool.query(`
          INSERT INTO sponsor_registrations 
          (id, companyName, contactPerson, email, phone, state, city, sponsorshipLevel, interestedTournaments, message, status, date) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, s);
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
  const { playerName, phone, email, state, city, ageCategory, category, partnerName, tournamentTitle, amountPaid, status } = req.body;
  const id = `pr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const date = new Date().toISOString();

  try {
    await pool.query(`
      INSERT INTO player_registrations 
      (id, playerName, phone, email, state, city, ageCategory, category, partnerName, tournamentTitle, amountPaid, status, date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, playerName, phone, email, state, city, ageCategory, category, partnerName || null, tournamentTitle, amountPaid, status || 'Paid', date]);
    
    res.status(201).json({ id, playerName, phone, email, state, city, ageCategory, category, partnerName, tournamentTitle, amountPaid, status, date });
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

app.post('/api/payments/create-order', async (req, res) => {
  const { amount } = req.body; // in paise
  try {
    const options = {
      amount: parseInt(amount, 10),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payments/verify', requireDb, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationData } = req.body;

  try {
    // Generate signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'MgmaWgJ3niZglmQ3Q338DuQ7')
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
      (id, playerName, phone, email, state, city, ageCategory, category, partnerName, tournamentTitle, amountPaid, status, date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, playerName, phone, email, state, city, ageCategory, category, partnerName || null, tournamentTitle, amountPaid, 'Paid', date]);

    res.json({ success: true, message: "Payment verified and registration recorded successfully.", id });
  } catch (error) {
    console.error("Payment verification or DB insertion failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Debug Database Operations
app.post('/api/db/reset', requireDb, async (req, res) => {
  try {
    await pool.query('DROP TABLE IF EXISTS player_registrations');
    await pool.query('DROP TABLE IF EXISTS tournament_applications');
    await pool.query('DROP TABLE IF EXISTS sponsor_registrations');
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
