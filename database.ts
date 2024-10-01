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


async function createInitialUsers() {
    if (await UserCollection.countDocuments() > 0) { return; }
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const userEmail = process.env.USER_EMAIL;
    const userPassword = process.env.USER_PASSWORD;

    if (!adminEmail || !adminPassword || !userEmail || !userPassword) {
        throw new Error("Admin and User email or password must be set in the environment");
    }

    const adminHash = await bcrypt.hash(adminPassword, saltRounds);
    const userHash = await bcrypt.hash(userPassword, saltRounds);

    await UserCollection.insertMany([
        { email: adminEmail, password: adminHash, role: "ADMIN", username: "admin" },
        { email: userEmail, password: userHash, role: "USER", username: "user" }  
    ]);
}

export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Username and password required");
    }
    console.log("Attempting to find user by username:", username);
    
    let user: User | null = await UserCollection.findOne({ username: username });
    console.log("User found:", user);
    
    if (user) {
        if (user.password && await bcrypt.compare(password, user.password)) {
            console.log("Password match!");
            return user;
        } else {
            console.log("Password incorrect");
            throw new Error("Password incorrect");
        }
    } else {
        console.log("User not found");
        throw new Error("User not found");
    }
}

export async function register(email: string, password: string, username: string) {
    if (email === "" || password === "" || username === "") {
        throw new Error("Email, password, and username are required");
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
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
