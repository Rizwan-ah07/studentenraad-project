import express, { Router, Request, Response } from "express";
import { generatePasswordResetToken, findUserByEmail, findUserByUsername } from "../database";
import { sendResetPasswordEmail } from "../utils/emailService"; 

export function forgotPasswordRouter(): Router {
    const router = express.Router();

    // GET /forgot-password - Show the forgot password form
    router.get("/forgot-password", (req: Request, res: Response) => {
        res.render("forgotPassword", { error: null, message: null });
    });

    // POST /forgot-password - Handle form submission
    router.post("/forgot-password", async (req: Request, res: Response) => {
        const { email } = req.body;

        try {
            if (!email) {
                throw new Error("Please provide your email.");
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error("Please enter a valid email address.");
            }

            // Generate reset token
            const resetToken = await generatePasswordResetToken(email);

            // Find user to get email
            const user = await findUserByEmail(email);

            if (!user) {
                // To prevent email enumeration, respond with the same message
                return res.render("checkEmail", { email });
            }

            // Send reset password email
            await sendResetPasswordEmail(user.email, resetToken);

            // Redirect to check your email page
            res.render("checkEmail", { email: user.email });
        } catch (e: any) {
            res.render("forgotPassword", { error: e.message, message: null });
        }
    });

    return router;
}