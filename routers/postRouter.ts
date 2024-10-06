import express, { Router, Request, Response } from "express";
import { User, Post } from "../interface";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { savePost, getAllPosts } from "../database";

export function postRouter(): Router {
    const router = express.Router();

    router.get("/", secureMiddleware, async (req, res) => {
        const posts: Post[] = await getAllPosts();
        res.render("index", {
            title: "Hello World",
            message: "Hello World",
            username: req.session?.user?.username ?? "Guest",
            role : req.session?.user?.role ?? "Guest",
            posts: posts
        })
    });

    router.post("/", secureMiddleware, async (req: Request, res: Response) => {
        const { title, anonymous, authorToSave, message } = req.body;
        if (!title || !message) {
            return res.status(400).redirect("/");
        }
        await savePost(title, anonymous, authorToSave, message);
        res.redirect("/");
    });

    return router;
}