// routes/resetPasswordRouter.ts

import express, { Router, Request, Response } from "express";
import { findUserByResetToken, updateUserPassword, findUserByEmail } from "../database";
import { sendPasswordResetConfirmationEmail } from "../utils/emailService";
import { User } from "../interface";

export function resetPasswordRouter(): Router {
    const router = express.Router();

    // GET /reset-password?token=... - Show the reset password form
    router.get("/reset-password", async (req: Request, res: Response) => {
        const { token } = req.query;

        if (!token || typeof token !== "string") {
            return res.status(400).send("Invalid or missing password reset token.");
        }

        try {
            const user = await findUserByResetToken(token);
            if (!user) {
                return res.status(400).send("Invalid or expired password reset token.");
            }

            res.render("resetPassword", { error: null, message: null, token });
        } catch (error) {
            console.error("Error during password reset:", error);
            res.status(500).send("Internal server error.");
        }
    });

    // POST /reset-password - Handle the new password submission
    router.post("/reset-password", async (req: Request, res: Response) => {
        const { token, newPassword, confirmPassword } = req.body;

        try {
            if (!token || typeof token !== "string") {
                throw new Error("Invalid or missing password reset token.");
            }

            if (!newPassword || !confirmPassword) {
                throw new Error("Please provide and confirm your new password.");
            }

            if (newPassword !== confirmPassword) {
                throw new Error("Passwords do not match.");
            }

            // Validate password requirements
            const passwordRequirements = {
                length: /.{8,}/,
                uppercase: /[A-Z]/,
                number: /[0-9]/,
                symbol: /[!@#$%^&*(),.?":{}|<>]/
            };

            const unmetRequirements = [];

            if (!passwordRequirements.length.test(newPassword)) {
                unmetRequirements.push("Password must be at least 8 characters long.");
            }
            if (!passwordRequirements.uppercase.test(newPassword)) {
                unmetRequirements.push("Password must contain at least one uppercase letter.");
            }
            if (!passwordRequirements.number.test(newPassword)) {
                unmetRequirements.push("Password must contain at least one number.");
            }
            if (!passwordRequirements.symbol.test(newPassword)) {
                unmetRequirements.push("Password must contain at least one special symbol.");
            }

            if (unmetRequirements.length > 0) {
                throw new Error(unmetRequirements.join(" "));
            }

            // Find user by token
            const user = await findUserByResetToken(token);
            if (!user) {
                throw new Error("Invalid or expired password reset token.");
            }

            // Update the user's password
            await updateUserPassword(user._id!, newPassword);

            // Automatically log in the user by setting session
            req.session.user = {
                id: user._id,
                username: user.username,
                role: user.role
            };

            // Optionally, send a confirmation email
            await sendPasswordResetConfirmationEmail(user.email);

            // Redirect to home page after successful reset and login
            res.redirect("/"); // Adjust the route as per your application
        } catch (e: any) {
            res.render("resetPassword", { error: e.message, message: null, token });
        }
    });

    return router;
}
