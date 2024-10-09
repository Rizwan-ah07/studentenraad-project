import express, { Router, Request, Response } from "express";
import { getAllUsers, getAllPosts, updateUser, deleteUser, deletePost } from "../database";
import { User, Post } from "../interface";
import { ensureAdmin } from "../middleware/secureMiddleware";
export function adminRouter(): Router {
    const router = express.Router();

    router.get("/admin", ensureAdmin, async (req: Request, res: Response) => {
        const users : User[] = await getAllUsers();
        const posts : Post[] = await getAllPosts();

        const { searchUser } = req.query;
        if (searchUser) {
            const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchUser.toString().toLowerCase() as string) ||
            user.email.toLowerCase().includes(searchUser.toString().toLowerCase() as string));
            return res.render("admin", { 
                users: filteredUsers,
                posts: posts,
                searchUser: searchUser,
                searchPost: "",
                username: req.session?.user?.username ?? "Guest",
                role: req.session?.user?.role ?? "GUEST"
            });
        }

        const { searchPost } = req.query;
        if (searchPost) {
            const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(searchPost.toString().toLowerCase() as string) || 
            post.message.toLowerCase().includes(searchPost.toString().toLowerCase() as string) || 
            post.author.username_lower.includes(searchPost.toString().toLowerCase() as string));
            return res.render("admin", { 
                users: users,
                posts: filteredPosts,
                searchUser: "",
                searchPost: searchPost,
                username: req.session?.user?.username ?? "Guest",
                role: req.session?.user?.role ?? "GUEST"
            });
        }

        res.render("admin", { 
            users: users,
            posts: posts,
            searchUser: searchUser,
            searchPost: searchPost,
            username: req.session?.user?.username ?? "Guest",
            role: req.session?.user?.role ?? "GUEST"
        });
    });

    router.post("/admin/edit-user", ensureAdmin, async (req: Request, res: Response) => {
        const {username, email, role} = req.body;
        // Update user
        await updateUser(username, email, role);
        res.status(200).json({message: "User updated"});
    });

    router.post("/admin/delete-user", ensureAdmin, async (req: Request, res: Response) => {
        const {username} = req.body;
        // Delete user
        await deleteUser(username);
        res.status(200).json({message: "User deleted"});
    });

    router.post("/admin/delete-post", ensureAdmin, async (req: Request, res: Response) => {
        const {postId} = req.body;
        // Delete post
        await deletePost(postId);
        res.status(200).json({message: "Post deleted"});
    });

    return router;
}