"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongodb_1 = require("mongodb");
const images_1 = require("./routes/images");
const auth_1 = require("./routes/auth");
const products_1 = require("./routes/products");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(staticDir));
async function setUpServer() {
    try {
        const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;
        if (!MONGO_USER || !MONGO_PWD || !MONGO_CLUSTER || !DB_NAME) {
            throw new Error("Missing required MongoDB environment variables.");
        }
        const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
        console.log("Attempting Mongo connection at " + connectionString.replace(/:(.*?)@/, ":*****@")); // Mask password
        const mongoClient = await mongodb_1.MongoClient.connect(connectionString);
        const db = mongoClient.db(DB_NAME);
        (0, auth_1.registerAuthRoutes)(app, mongoClient);
        app.use("/api/*", auth_1.verifyAuthToken);
        (0, images_1.registerImageRoutes)(app, mongoClient);
        (0, products_1.registerProductRoutes)(app, mongoClient);
        app.get("/hello", (req, res) => {
            res.send("Hello, World");
        });
        const filePath = path_1.default.resolve("/Users/saiyushikumar/Desktop/csc437/packages/routing-lab/dist", "index.html");
        app.get("*", (req, res) => {
            res.sendFile(filePath, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                    res.status(err.status || 500).send(err.message);
                }
            });
        });
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Error setting up server:", error);
    }
}
setUpServer();
//sendFile("index.html, {root: staticDir}}")
