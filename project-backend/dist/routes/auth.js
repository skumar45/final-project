"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.verifyAuthToken = verifyAuthToken;
exports.registerAuthRoutes = registerAuthRoutes;
const CredentialsProvider_1 = require("./CredentialsProvider");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("Missing JWT_SECRET from env file");
}
async function loginUser(req, res, credentialsProvider) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }
        const isPasswordValid = await credentialsProvider.verifyPassword(username, password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ username }, secretKey, { expiresIn: "1d" });
        res.json({ token }); // ✅ No need for return
    }
    catch (error) {
        console.error("Error processing login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
function verifyAuthToken(req, res, next) {
    const authHeader = req.get("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return;
    }
    jsonwebtoken_1.default.verify(token, secretKey, (error, decoded) => {
        if (error) {
            res.status(403).json({ error: "Forbidden: Invalid token" });
            return;
        }
        next(); // ✅ Only call next() if token is valid
    });
}
function registerAuthRoutes(app, mongoClient) {
    const credentialsProvider = new CredentialsProvider_1.CredentialsProvider(mongoClient);
    app.post("/auth/register", async (req, res) => {
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
        }
        catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
    app.post("/auth/login", async (req, res) => {
        await loginUser(req, res, credentialsProvider);
    });
}
