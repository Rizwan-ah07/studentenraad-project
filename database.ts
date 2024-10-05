import { Collection, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { google } from "googleapis";
import { User, Post } from "./interface";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const client = new MongoClient(MONGODB_URI);
const saltRounds: number = 10;

export const UserCollection: Collection<User> = client.db("studentenraad-project").collection<User>("users");
export const PostCollection: Collection<any> = client.db("studentenraad-project").collection<Post>("posts");

export async function findUserByEmail(email: string) {
    return await UserCollection.findOne({ email_lower: email.toLowerCase() });
}

export async function findUserByUsername(username: string) {
    return await UserCollection.findOne({ username_lower: username.toLowerCase() });
}

export async function findRoleByUsername(username: string) {
    const user = await UserCollection.findOne({ username: username });
    return user?.role;
}

export async function getAllUsers() {
    return await UserCollection.find().toArray();
}

export async function getAllPosts() {
    return await PostCollection.find().toArray();
}

export async function updateUser(username: string, email: string, role: "ADMIN" | "USER") {
    const user = await UserCollection.findOne({ username: username });
    if (!user) {
        throw new Error("User not found");
    }

    const update = {
        $set: {
            email: email,
            role: role
        }
    };

    try {
        await UserCollection.updateOne({ username: username }, update);
    }
    catch (error) {
        throw new Error("Error updating user");
    }
}

export async function deleteUser(username: string) {
    try {
        await UserCollection.deleteOne({ username: username });
    }
    catch (error) {
        throw new Error("Error deleting user");
    }
}

export async function deletePost(postId: string) {
    try {
        await PostCollection.deleteOne({ _id: new ObjectId(postId) });
    }
    catch (error) {
        throw new Error("Error deleting post");
    }
}

async function createInitialUsers() {
    if (await UserCollection.countDocuments() > 0) { return; }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const secondAdminEmail = process.env.SECOND_ADMIN_EMAIL;
    const secondAdminPassword = process.env.SECOND_ADMIN_PASSWORD;
    const userEmail = process.env.USER_EMAIL;
    const userPassword = process.env.USER_PASSWORD;

    if (!adminEmail || !adminPassword || !secondAdminEmail || !secondAdminPassword || !userEmail || !userPassword) {
        throw new Error("Admin and User email or password must be set in the environment");
    }

    const adminHash = await bcrypt.hash(adminPassword, saltRounds);
    const secondAdminHash = await bcrypt.hash(secondAdminPassword, saltRounds);
    const userHash = await bcrypt.hash(userPassword, saltRounds);

    await UserCollection.insertMany([
        { email: adminEmail, email_lower: adminEmail.toLowerCase(), password: adminHash, role: "ADMIN", username: "Rizwan", username_lower: "rizwan", verified: true, course: "Admin Course", verificationToken: crypto.randomBytes(32).toString("hex") },
        { email: secondAdminEmail, email_lower: secondAdminEmail.toLowerCase(), password: secondAdminHash, role: "ADMIN", username: "Precious", username_lower: "precious", verified: true, course: "Admin Course", verificationToken: crypto.randomBytes(32).toString("hex") },
        { email: userEmail, email_lower: userEmail.toLowerCase(), password: userHash, role: "USER", username: "user", username_lower: "user", verified: true, course: "User Course", verificationToken: crypto.randomBytes(32).toString("hex") }
    ]);
}

async function createInitialPosts() {
    if (await PostCollection.countDocuments() > 0) { return; }

    await PostCollection.insertMany([
        { title: "First Post", author: "Rizwan", content: "This is the first post" },
        { title: "Second Post", author: "Precious", content: "This is the second post" },
        { title: "Third Post", author: "Rizwan", content: "This is the third post" }
    ]);
}

export async function loginWithEmailOrUsername(loginIdentifier: string, password: string) {
    if (loginIdentifier === "" || password === "") {
        throw new Error("Email/Username and password required");
    }

    const isEmail = loginIdentifier.includes("@");
    let user: User | null;

    if (isEmail) {
        user = await findUserByEmail(loginIdentifier);
    } else {
        user = await findUserByUsername(loginIdentifier);
    }

    if (!user) {
        throw new Error("User not found.");
    }

    if (!user.verified) {
        throw new Error("Your email has not been verified. Please check your inbox.");
    }

    if (user.password && await bcrypt.compare(password, user.password)) {
        return user;
    } else {
        throw new Error("Invalid password.");
    }
}

export async function register(email: string, password: string, username: string, course: string) {
    console.log("Register function called with:", email, username, course);
    if (email === "" || password === "" || username === "" || course === "") {
        throw new Error("Email, password, username, and course are required");
    }

    // Server-side password validation
    const passwordRequirements = {
        length: /.{8,}/,
        uppercase: /[A-Z]/,
        number: /[0-9]/,
        symbol: /[!@#$%^&*(),.?":{}|<>]/
    };

    const unmetRequirements = [];

    if (!passwordRequirements.length.test(password)) {
        unmetRequirements.push("Password must be at least 8 characters long.");
    }
    if (!passwordRequirements.uppercase.test(password)) {
        unmetRequirements.push("Password must contain at least one uppercase letter.");
    }
    if (!passwordRequirements.number.test(password)) {
        unmetRequirements.push("Password must contain at least one number.");
    }
    if (!passwordRequirements.symbol.test(password)) {
        unmetRequirements.push("Password must contain at least one special symbol.");
    }

    if (unmetRequirements.length > 0) {
        throw new Error(unmetRequirements.join(" "));
    }

    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
        throw new Error("User with this email already exists");
    }

    const existingUserByUsername = await findUserByUsername(username);
    if (existingUserByUsername) {
        throw new Error("Username is already taken. Please choose a different username.");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser: User = {
        email: email, // Store original email
        email_lower: email.toLowerCase(), // Store lowercase email
        password: hashedPassword,
        username: username, // Store original username
        username_lower: username.toLowerCase(), // Store lowercase username
        role: "USER",
        verified: false,
        verificationToken: verificationToken,
        course: course 
    };

    const result = await UserCollection.insertOne(newUser);

    console.log("Calling sendVerificationEmail with:", email, verificationToken);
    await sendVerificationEmail(email, verificationToken);

    return result.insertedId;
}


async function sendVerificationEmail(email: string, token: string) {
    try {
        console.log("Starting email verification process...");

        const verificationUrl = `http://apstudentenraad.onrender.com/verify?token=${token}`;
        console.log("Verification URL: ", verificationUrl);

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
            subject: "Email Verification",
            text: `Please verify your email by clicking the link: ${verificationUrl}`,
            html: `<p>Please verify your email by clicking the link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
        };

        console.log("Mail options set");

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");

    } catch (error) {
        console.error("Error in sendVerificationEmail:", error);
        throw error;
    }
}


async function exit() {
    try {
        await client.close();
        console.log('Disconnected from database');
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    try {
        await client.connect();
        await createInitialUsers();
        await createInitialPosts();
        console.log("Connected to the database");
        process.on('SIGINT', exit);
    } catch (error) {
        console.log('Error connecting to the database: ' + error);
    }
}
function sendEmail(email: string, arg1: string, arg2: string, arg3: string) {
    throw new Error("Function not implemented.");
}

