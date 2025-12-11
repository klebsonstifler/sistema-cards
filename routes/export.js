import express from "express";
import { all } from "../db.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") return res.status(403).send("Não autorizado");
  next();
}

router.get("/csv", requireAdmin, async (req, res) => {
  try {
    const rows = await all("SELECT * FROM cards");
    const header = Object.keys(rows[0] || {}).join(",") + "\n";
    const body = rows.map(r => Object.values(r).map(v => `"${(v || "").toString().replace(/\"/g, '""')}"`).join(",")).join("\n");
    res.setHeader("Content-disposition", "attachment; filename=cards.csv");
    res.setHeader("Content-Type", "text/csv");
    res.send(header + body);
  } catch (e) {
    console.error(e);
    res.status(500).send("Erro");
  }
});

export default router;
