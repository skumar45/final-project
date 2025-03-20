import express, { Request, Response, NextFunction } from "express";
import { MongoClient } from "mongodb";
import { CredentialsProvider } from "./CredentialsProvider";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET as string;
if (!secretKey) {
    throw new Error("Missing JWT_SECRET from env file");
}

export async function loginUser(req: Request, res: Response, credentialsProvider: CredentialsProvider) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }

        const isPasswordValid = await credentialsProvider.verifyPassword(username, password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ username }, secretKey, { expiresIn: "1d" });

        res.json({ token }); // ✅ No need for return
    } catch (error) {
        console.error("Error processing login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export function verifyAuthToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
    }

    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            res.status(403).json({ error: "Forbidden: Invalid token" });
        return;
        }
        next(); // ✅ Only call next() if token is valid
    });
}

export function registerAuthRoutes(app: express.Application, mongoClient: MongoClient) {
    const credentialsProvider = new CredentialsProvider(mongoClient);

    app.post("/auth/register", async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ error: "Missing username or password" });
            return;
            }

            const success = await credentialsProvider.registerUser(username, password);

            if (!success) {
                res.status(400).json({ error: "Username already taken" });
            return;
            }

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.post("/auth/login", async (req: Request, res: Response) => {
        await loginUser(req, res, credentialsProvider);
    });
}
