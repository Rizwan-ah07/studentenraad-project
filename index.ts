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

app.get("/", (req, res) => {
    res.render("index", {
        title: "Hello World",
        message: "Hello World"
    })
});


app.post("/login", async (req: Request, res: Response) => {
  try {
      const { email, password } = req.body;
      const user = await login(email, password);
      if (req.session) {
          req.session.user = user;
      }
      res.redirect("/");
  } catch (error) {
      if (error instanceof Error) {
          res.status(401).send(error.message);
      } else {
          res.status(401).send("Unknown error occurred");
      }
  }
});

app.post("/register", async (req: Request, res: Response) => {
  try {
      const { email, password } = req.body;
      await register(email, password);
      res.redirect("/login");
  } catch (error) {
      if (error instanceof Error) {
          res.status(400).send(error.message);
      } else {
          res.status(400).send("Unknown error occurred");
      }
  }
});

app.listen(port, async () => {
    await connect();
    console.log(`[server] http://localhost:${port}`);
});