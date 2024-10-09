import express, { Router, Request, Response } from "express";
import { loginWithEmailOrUsername } from "../database"; 
import { checkLogin } from "../middleware/secureMiddleware";
import { User } from "../interface";

declare module "express-session" {
    interface SessionData {
        user: { [key: string]: any };
    }
}

export function loginRouter(): Router {
    const router = express.Router();

    router.get("/login", checkLogin, (req: Request, res: Response) => {
        res.render("login", { error: null, message: req.query.message });
    });

    router.post("/login", async (req: Request, res: Response) => {
        const { loginIdentifier, password } = req.body;  

        try {
            const user: User = await loginWithEmailOrUsername(loginIdentifier, password);
            delete user.password;
            if (req.session) {
                req.session.user = user;
            }
            //res.redirect("/?message=Login%20successful");
            res.redirect("/");
        } catch (e: any) {
            res.render("login", { error: e.message, message: null });
        }
    });

    router.post("/logout", (req: Request, res: Response) => {
        req.session.destroy(() => {
            res.redirect("/login?message=Logout%20successful");
        });
    });

    return router;
}