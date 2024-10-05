
import express, { Router, Request, Response } from "express";
import { register } from "../database";
import { checkLogin } from "../middleware/secureMiddleware";

export function registerRouter(): Router {
    const router = express.Router();

    router.get("/register", checkLogin, (req: Request, res: Response) => {
        res.render("register", { error: null });  
    });

    router.post("/register", async (req: Request, res: Response) => {
        const { email, password, username, course } = req.body;

        try {
            if (!email.endsWith('@ap.be')) {
                throw new Error("Gebruik je school email die begint met 's' en eidigt met @ap.be.");
            }
            await register(email, password, username, course);
            res.redirect("/verification-pending");  
        } catch (e: any) {
            res.render("register", { error: e.message });
        }
    });

    return router;
}