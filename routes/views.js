import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile("login.html", { root: "views" });
});

router.get("/dashboard", (req, res) => {
    if (!req.cookies.user) return res.redirect("/");
    res.sendFile("dashboard.html", { root: "views" });
});

router.get("/cards", (req, res) => {
    if (!req.cookies.user) return res.redirect("/");
    res.sendFile("cards.html", { root: "views" });
});

export default router;
