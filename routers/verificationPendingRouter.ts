import express, { Router, Request, Response } from "express";

export function verificationPendingRouter(): Router {
    const router = express.Router();

    router.get("/verification-pending", (req: Request, res: Response) => {
        res.render("verificationPending");
    });

    return router;
}