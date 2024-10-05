import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    email: string; 
    email_lower: string; 
    password?: string;
    username: string; 
    username_lower: string; 
    role: "ADMIN" | "USER";
    verified: boolean;
    verificationToken: string;
    course: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

    export interface Post {
    _id?: ObjectId;
    title: string;
    author: string;
    content: string;
}



