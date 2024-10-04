import { NextFunction, Request, Response } from "express";
import { findUserByUsername } from "../database";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        return res.redirect("/login"); // If there's no user in session, redirect to login
    }

    try {
        const user = await findUserByUsername(req.session.user.username);

        if (user && user.role === "ADMIN") {
            next();
        }
        else{
            res.status(403).redirect("/");
        }
    }catch(e){
        res.status(403).redirect("/");
    }
}