import express from "express";
import bcrypt from "bcryptjs";
import { get } from "../db.js";

const router = express.Router();

// login page
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// login submit
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const row = await get("SELECT * FROM users WHERE username = ?", [username]);
    if (!row) return res.render("login", { error: "Usuário ou senha inválidos" });
    const ok = bcrypt.compareSync(password, row.password);
    if (!ok) return res.render("login", { error: "Usuário ou senha inválidos" });

    // session
    req.session.user = { username: row.username, role: row.role };
    return res.redirect("/app");
  } catch (err) {
    console.error(err);
    return res.render("login", { error: "Erro interno" });
  }
});

// logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

export default router;
    