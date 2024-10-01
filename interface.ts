import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    role: "ADMIN" | "USER";
    email: string;
    username: string; 
    password?: string;
}
