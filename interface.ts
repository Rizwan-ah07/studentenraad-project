import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    role: "ADMIN" | "USER";
    email: string;
    username: string; 
    password?: string;
}

export interface Post {
    _id?: ObjectId;
    title: string;
    author: string;
    content: string;
}
