import express, { Router, Request, Response } from "express";
import { getAllUsers } from "../database";

export function adminRouter(): Router {
    const router = express.Router();

    router.get("/admin", (req: Request, res: Response) => {
        const users = getAllUsers();
        res.render("admin", { error: null, users: users });
    });

    return router;
}