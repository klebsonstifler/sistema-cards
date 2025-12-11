import express from "express";
import multer from "multer";
import path from "path";
import { run, all, get } from "../db.js";

const router = express.Router();

// upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), "public", "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// middlewares
function requireLogin(req, res, next) {
  if (!req.session.user) return res.status(403).render("error", { message: "Não autorizado" });
  next();
}
function requireAdminAPI(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") return res.status(403).json({ error: "Ação restrita" });
  next();
}
function requireAdminView(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") return res.status(403).render("error", { message: "Ação restrita" });
  next();
}

// List (JSON) - usado por front-end
router.get("/listar", requireLogin, async (req, res) => {
  try {
    const rows = await all("SELECT * FROM cards ORDER BY id DESC");
    return res.json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "DB error" });
  }
});

// Create (admin) - accepts multipart form
router.post("/novo", requireLogin, upload.single("foto"), requireAdminAPI, async (req, res) => {
  try {
    const { nome, cpf, rg, art, qth, status, obs } = req.body;
    const foto = req.file ? "/uploads/" + req.file.filename : null;
    await run(`INSERT INTO cards (nome,cpf,rg,art,qth,status,obs,foto) VALUES (?,?,?,?,?,?,?,?)`,
      [nome, cpf, rg, art, qth, status, obs, foto]);
    await run(`INSERT INTO logs (action,card_id,user) VALUES (?, ?, ?)`, ["create", null, req.session.user.username]);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "DB error" });
  }
});

// Edit (admin) - partial via form
router.post("/editar/:id", requireLogin, upload.single("foto"), requireAdminAPI, async (req, res) => {
  const id = req.params.id;
  try {
    const { nome, cpf, rg, art, qth, status, obs } = req.body;
    const row = await get("SELECT foto FROM cards WHERE id = ?", [id]);
    let fotoToSave = row ? row.foto : null;
    if (req.file) fotoToSave = "/uploads/" + req.file.filename;
    await run("UPDATE cards SET nome=?,cpf=?,rg=?,art=?,qth=?,status=?,obs=?,foto=? WHERE id=?",
      [nome, cpf, rg, art, qth, status, obs, fotoToSave, id]);
    await run(`INSERT INTO logs (action,card_id,user) VALUES (?,?,?)`, ["edit", id, req.session.user.username]);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "DB error" });
  }
});

// Delete (admin)
router.delete("/deletar/:id", requireLogin, requireAdminAPI, async (req, res) => {
  const id = req.params.id;
  try {
    await run("DELETE FROM cards WHERE id = ?", [id]);
    await run("INSERT INTO logs (action,card_id,user) VALUES (?,?,?)", ["delete", id, req.session.user.username]);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "DB error" });
  }
});

export default router;
