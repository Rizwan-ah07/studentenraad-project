import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import { loginRouter } from "./routers/loginRouter";
import { registerRouter } from "./routers/registerRouter";
import { suggestionsRouter } from "./routers/suggestionRouter";
import { verifyRouter } from "./routers/verifyRouter";
import { adminRouter } from "./routers/adminRouter";
import { verificationPendingRouter } from "./routers/verificationPendingRouter";
import { connect } from "./database";
import { forgotPasswordRouter } from "./routers/forgotPasswordRouter";
import { resetPasswordRouter } from "./routers/resetPasswordRouter";
import { postRouter } from "./routers/postRouter";
import { announcementRouter } from "./routers/announcementRouter";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SESSION_SECRET || 'your secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookie in production
}));

app.set("view engine", "ejs");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));



// Apply your routers
app.use(loginRouter());
app.use(registerRouter());
app.use(suggestionsRouter());
app.use(adminRouter());
app.use(verifyRouter());
app.use(verificationPendingRouter());
app.use(forgotPasswordRouter());
app.use(resetPasswordRouter());
app.use(postRouter());
app.use(announcementRouter());

// 404 Error handler
app.use((_, res) => {
    res.status(404).render("error", { message: "Page not found" });
});

// Start the server and connect to the database
app.listen(port, async () => {
    try {
        await connect();
        console.log(`[server] http://localhost:${port}`);
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1); // Exit the process if the database connection fails
    }
});
