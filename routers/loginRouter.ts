import express, { Router, Request, Response } from "express";
import { login } from "../database";
import { checkLogin } from "../middleware/secureMiddleware";
import { User } from "../interface";

export function loginRouter(): Router {
    const router = express.Router();

    router.get("/login", checkLogin, (req: Request, res: Response) => {
        res.render("login"); 
    });

    router.post("/login", async (req: Request, res: Response) => {
        const { email, password } = req.body;  
        try {
            const user: User = await login(email, password); 
            delete user.password;  
            if (req.session) {
                req.session.user = user;  
            }
            res.redirect("/");  
        } catch (e: any) {
            res.render("login", { error: e.message });  
        }
    });

    router.post("/logout", (req: Request, res: Response) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    });

    return router;
}