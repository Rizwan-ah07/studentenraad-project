import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

// Function to send reset password email
export async function sendResetPasswordEmail(email: string, token: string) {
    try {
        console.log("Starting password reset email process...");

        const resetUrl = `http://apstudentenraad.onrender.com/reset-password?token=${token}`;
        console.log("Reset URL: ", resetUrl);

        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID!,
            process.env.CLIENT_SECRET!,
            "https://developers.google.com/oauthplayground" // Redirect URL
        );

        console.log("OAuth2 client initialized");

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN!,
        });

        const accessTokenResponse = await oauth2Client.getAccessToken();
        const accessToken = accessTokenResponse?.token;

        if (!accessToken) {
            throw new Error("Failed to retrieve access token");
        }

        console.log("Access token retrieved: ", accessToken);

        const smtpOptions: SMTPTransport.Options = {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                type: "OAuth2",
                user: process.env.SMTP_USER!,
                clientId: process.env.CLIENT_ID!,
                clientSecret: process.env.CLIENT_SECRET!,
                refreshToken: process.env.REFRESH_TOKEN!,
                accessToken: accessToken,
            },
        };

        console.log("SMTP options set");

        const transporter = nodemailer.createTransport(smtpOptions);
        console.log("Transporter created");

        const mailOptions = {
            from: `"Studentenraad - Project" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
            html: `<p>You requested a password reset. Please click the link below to reset your password:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>
                   <p>If you did not request this, please ignore this email.</p>`,
        };

        console.log("Mail options set");

        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully");

    } catch (error) {
        console.error("Error in sendResetPasswordEmail:", error);
        throw error;
    }
}