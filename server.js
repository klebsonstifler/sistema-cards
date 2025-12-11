const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");

// CONFIGURAÇÕES BÁSICAS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// SERVE ARQUIVOS ESTÁTICOS (CSS / JS / IMAGENS)
app.use(express.static(path.join(__dirname, "public")));

// PARSERS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// SESSÕES
app.use(session({
    secret: "segredo_super_secreto",
    resave: false,
    saveUninitialized: true
}));

// UPLOAD CONFIG (somente para foto)
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/uploads");
    },
    filename: function (req, file, callback) {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
        callback(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// MIDDLEWARE DE AUTENTICAÇÃO
function auth(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/");
    }
    next();
}

// ROTAS
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;

    // MOCK — substitua pelo seu banco.
    if (username === "admin" && password === "123") {
        req.session.user = { username, role: "admin" };
        return res.redirect("/app");
    }
    if (username === "user" && password === "123") {
        req.session.user = { username, role: "user" };
        return res.redirect("/app");
    }

    res.send("Login inválido");
});

app.post("/auth/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// TELA PRINCIPAL (PROTEGIDA)
app.get("/app", auth, (req, res) => {
    res.render("app", { user: req.session.user });
});

// (EXEMPLO) ROTA PARA CRIAR REGISTRO
app.post("/registro", auth, upload.single("foto"), (req, res) => {
    console.log("Novo registro:", req.body, req.file);
    res.send("Registro criado");
});

// INICIAR SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});