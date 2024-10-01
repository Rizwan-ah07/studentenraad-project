import express, { Router, Request, Response } from "express";
import { register } from "../database";
import { checkLogin } from "../middleware/secureMiddleware";

export function registerRouter(): Router {
    const router = express.Router();

    router.get("/register", checkLogin, (req: Request, res: Response) => {
        res.render("register");
    });

    router.post("/register", async (req: Request, res: Response) => {
        const { email, password, username } = req.body;  
    
        try {
            await register(email, password, username);  
            res.redirect("/login");
        } catch (e: any) {
            res.render("register", { error: e.message });
        }
    });

    return router;
}
