import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import { secureMiddleware, checkLogin, ensureAdmin } from "./middleware/secureMiddleware";
import { ObjectId } from "mongodb";
import { User } from "./interface";
import { loginRouter } from "./routers/loginRouter";
import { registerRouter } from "./routers/registerRouter";
import { connect, login, register } from "./database";
import { env } from "process";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

declare module "express-session" {
    interface SessionData {
        user: { [key: string]: any };
    }
}

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true
}));

app.use(loginRouter());
app.use(registerRouter());

app.get("/", /*secureMiddleware, */(req, res) => {
    res.render("index", {
        title: "Hello World",
        message: "Hello World",
        fontawesome: process.env.FONTAWESOME as string
    })
});

app.use((req, res, next) => {
    res.status(404).render("error", { message: "Page not found" });
});




app.listen(port, async () => {
    await connect();
    console.log(`[server] http://localhost:${port}`);
});