import express, { Request, Response } from "express";

export function announcementRouter(): express.Router {
    const router = express.Router();

    router.get("/announcement", async (req: Request, res: Response) => {
        res.render("announcement", { 
            username: req.session?.user?.username ?? "Guest",
            role: req.session?.user?.role ?? "GUEST"
        });
    });

    return router;
}