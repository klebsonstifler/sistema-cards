import express from "express";
import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";

const router = express.Router();
const db = new sqlite3.Database("database.db");

// cria tabela se não existir
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
)
`);

const adminUser = "KlebsonOliveira";
const adminPass = bcrypt.hashSync("Brasfoot@2010", 10);

const viewerUser = "2pel";
const viewerPass = bcrypt.hashSync("barrinha2pel", 10);

// cria usuários se não existirem
db.get("SELECT * FROM users WHERE username=?", [adminUser], (err, row) => {
    if (!row) db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [adminUser, adminPass, "admin"]);
});

db.get("SELECT * FROM users WHERE username=?", [viewerUser], (err, row) => {
    if (!row) db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [viewerUser, viewerPass, "viewer"]);
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username=?", [username], (err, user) => {
        if (!user) return res.redirect("/?error=1");

        if (!bcrypt.compareSync(password, user.password)) {
            return res.redirect("/?error=1");
        }

        res.cookie("user", user.username);
        res.cookie("role", user.role);

        res.redirect("/dashboard");
    });
});

router.get("/logout", (req, res) => {
    res.clearCookie("user");
    res.clearCookie("role");
    res.redirect("/");
});

export default router;
