import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    email: string;
    username: string;
    password?: string;

    role: "ADMIN" | "USER";
    verified: boolean;
    verificationToken?: string;
    

}

    export interface Post {
    _id?: ObjectId;
    title: string;
    author: string;
    content: string;
}



