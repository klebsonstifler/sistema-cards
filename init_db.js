import { run } from "./db.js";
import bcrypt from "bcryptjs";

async function init() {
  // users table
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  // cards table
  await run(`CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    cpf TEXT,
    rg TEXT,
    art TEXT,
    qth TEXT,
    status TEXT,
    obs TEXT,
    foto TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);

  // logs
  await run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    card_id INTEGER,
    user TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);

  const admin = "KlebsonOliveira";
  const adminPass = bcrypt.hashSync("Brasfoot@2010", 10);

  const viewer = "2pel";
  const viewerPass = bcrypt.hashSync("barrinha2pel", 10);

  // insert if not exists
  try {
    await run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, [admin, adminPass, "admin"]);
    await run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, [viewer, viewerPass, "viewer"]);
    console.log("DB inicializado. Usuários criados/confirmados: admin and viewer.");
  } catch (e) {
    console.error("Erro ao inserir usuários:", e);
  }
}

init().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
