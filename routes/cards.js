import express from "express";
import multer from "multer";
import sqlite3 from "sqlite3";

const router = express.Router();
const db = new sqlite3.Database("database.db");

// UPLOAD CONFIG
const storage = multer.diskStorage({
    destination: "public/uploads/",
    filename: (_, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// cria tabela de cards
db.run(`
CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    cpf TEXT,
    rg TEXT,
    art TEXT,
    qth TEXT,
    status TEXT,
    observacao TEXT,
    foto TEXT
)
`);

router.post("/add", upload.single("foto"), (req, res) => {
    if (req.cookies.role !== "admin") {
        return res.send("Acesso negado.");
    }

    const { nome, cpf, rg, art, qth, status, observacao } = req.body;
    const foto = req.file ? req.file.filename : null;

    db.run(
        `INSERT INTO cards (nome, cpf, rg, art, qth, status, observacao, foto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, cpf, rg, art, qth, status, observacao, foto],
        () => res.redirect("/cards")
    );
});

router.get("/list", (req, res) => {
    const filtro = req.query.filtro || "";
    const buscar = `%${filtro}%`;

    db.all(
        "SELECT * FROM cards WHERE cpf LIKE ? OR rg LIKE ?",
        [buscar, buscar],
        (err, rows) => res.json(rows)
    );
});

export default router;
