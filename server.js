import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import cardRoutes from "./routes/cards.js";
import viewRoutes from "./routes/views.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ROTAS
app.use("/", viewRoutes);
app.use("/auth", authRoutes);
app.use("/cards", cardRoutes);

// SERVER
app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
