import { Collection, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "./interface";
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const client = new MongoClient(MONGODB_URI);
const saltRounds: number = 10;

export const UserCollection: Collection<User> = client.db("studentenraad-project").collection<User>("users");

export async function findUserByEmail(email: string) {
    return await UserCollection.findOne({ email: email });
}

export async function findUserByUsername(username: string) {
    return await UserCollection.findOne({ username: username });
}

export async function getAllUsers() {
    return await UserCollection.find().toArray();
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
        throw new Error("All admin and user email/password must be set in the environment");
    }

    const adminHash = await bcrypt.hash(adminPassword, saltRounds);
    const secondAdminHash = await bcrypt.hash(secondAdminPassword, saltRounds);
    const userHash = await bcrypt.hash(userPassword, saltRounds);

    await UserCollection.insertMany([
        { email: adminEmail, password: adminHash, role: "ADMIN", username: "Rizwan" },
        { email: secondAdminEmail, password: secondAdminHash, role: "ADMIN", username: "Precious" },
        { email: userEmail, password: userHash, role: "USER", username: "user" }
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

    if (user && user.password && await bcrypt.compare(password, user.password)) {
        return user;
    } else {
        throw new Error("Invalid email/username or password");
    }
}

export async function register(email: string, password: string, username: string) {
    if (email === "" || password === "" || username === "") {
        throw new Error("Email, password, and username are required");
    }

    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
    }

    // Check if the email is already registered
    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
        throw new Error("User with this email already exists");
    }

    // Check if the username is already registered
    const existingUserByUsername = await findUserByUsername(username);
    if (existingUserByUsername) {
        throw new Error("Username is already taken. Please choose a different username.");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser: User = {
        email: email,
        password: hashedPassword,
        username: username,
        role: "USER"
    };

    const result = await UserCollection.insertOne(newUser);
    return result.insertedId;
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
        console.log("Connected to the database");
        process.on('SIGINT', exit);
    } catch (error) {
        console.log('Error connecting to the database: ' + error);
    }
}
