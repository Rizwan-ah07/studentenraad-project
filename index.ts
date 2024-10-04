import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import { secureMiddleware, checkLogin } from "./middleware/secureMiddleware";
import { loginRouter } from "./routers/loginRouter";
import { registerRouter } from "./routers/registerRouter";
import { suggestionsRouter } from "./routers/suggestionRouter";
import { verifyRouter } from "./routers/verifyRouter";
import { connect } from "./database";


dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

declare module "express-session" {
    interface SessionData {
        user: { [key: string]: any };
    }
}

app.set("view engine", "ejs");
app.use(express.json({ limit: "1mb" }));
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
app.use(suggestionsRouter());
app.use(verifyRouter());

app.get("/", secureMiddleware, (req, res) => {
    res.render("index", {
        title: "Hello World",
        message: "Hello World",
        username: req.session?.user?.username ?? "Guest"
    })
});


app.use((req, res) => {
    res.status(404).render("error", { message: "Page not found" });
});

app.listen(port, async () => {
    await connect();
    console.log(`[server] http://localhost:${port}`);
});
