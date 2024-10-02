import express, { Router, Request, Response } from "express";
import { register } from "../database";
import { checkLogin } from "../middleware/secureMiddleware";

export function registerRouter(): Router {
    const router = express.Router();

    router.get("/register", checkLogin, (req: Request, res: Response) => {
        res.render("register", { error: null });  
    });

    router.post("/register", async (req: Request, res: Response) => {
        const { email, password, username } = req.body;

        try {
            if (!email.endsWith('@ap.be')) {
                throw new Error("Je moet een email gebruiken met je school email die begint met s en eidigt met @ap.be.");
            }

            await register(email, password, username);
            res.redirect("/login?message=Registration%20successful");  
        } catch (e: any) {
            res.render("register", { error: e.message });
        }
    });

    return router;
}