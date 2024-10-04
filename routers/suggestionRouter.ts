import express, { Router, Request, Response } from "express";
import { UserCollection } from "../database";

require('dotenv').config();

export function suggestionsRouter(): Router {
    const router = express.Router();

    router.get("/suggestions", (req: Request, res: Response) => {
        if (req.session.user) {
            res.render("suggestions", { user: req.session.user });
        } else {
            res.redirect("/login");
        }
    });

    router.post("/suggestions", async (req: Request, res: Response) => {
        const { username, message } = req.body;
        console.log('SMTP_USER:', process.env.SMTP_USER);
        console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD);
        try {
            if (!username || !message) {
                return res.status(400).send("All fields are required.");
            }

            console.log(`New suggestion from ${username}: ${message}`);

            res.status(200).send("Your message has been received.");
        } catch (error) {
            console.error("Error handling suggestion:", error);
            res.status(500).send("An error occurred while processing your message.");
        }
    });
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD);
    return router;
}
