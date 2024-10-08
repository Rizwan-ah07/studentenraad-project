import express, { Router, Request, Response } from "express";
import { UserCollection, findUserByEmail } from "../database";
import { User } from "../interface";

export function verifyRouter(): Router {
    const router = express.Router();

    router.get("/verify", async (req: Request, res: Response) => {
        const { token } = req.query;

        try {
            if (!token || typeof token !== "string") {
                return res.status(400).send("Invalid verification token.");
            }

            // Find user by verification token
            const user = await UserCollection.findOne({ verificationToken: token });

            if (!user) {
                return res.status(400).send("Invalid or expired verification token.");
            }

            // Mark user as verified
            await UserCollection.updateOne(
                { _id: user._id },
                { $set: { verified: true }, $unset: { verificationToken: "" } }
            );

            // Automatically log in the user by setting session
            req.session.user = {
                id: user._id,
                username: user.username,
                role: user.role
            };

            // Redirect to home page after successful verification and login
            res.redirect("/"); // Adjust the route as per your application
        } catch (error) {
            console.error("Error during email verification:", error);
            res.status(500).send("Internal server error.");
        }
    });

    return router;
}