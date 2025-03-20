import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { registerImageRoutes } from "./routes/images";
import { registerAuthRoutes, verifyAuthToken } from "./routes/auth";
import { registerProductRoutes } from "./routes/products"; 


dotenv.config();

const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";
const app = express();

app.use(express.json());
app.use(express.static(staticDir));

async function setUpServer() {
    try {
        const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;
        
        if (!MONGO_USER || !MONGO_PWD || !MONGO_CLUSTER || !DB_NAME) {
            throw new Error("Missing required MongoDB environment variables.");
        }

        const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
        console.log("Attempting Mongo connection at " + connectionString.replace(/:(.*?)@/, ":*****@")); // Mask password


        const mongoClient = await MongoClient.connect(connectionString);
        const db = mongoClient.db(DB_NAME);


        registerAuthRoutes(app, mongoClient);
        app.use("/api/*", verifyAuthToken);
        registerImageRoutes(app, mongoClient);


        registerProductRoutes(app, mongoClient);


        app.get("/hello", (req: Request, res: Response) => {
            res.send("Hello, World");
        });

        const filePath = path.resolve("/Users/saiyushikumar/Desktop/csc437/packages/routing-lab/dist", "index.html");
        app.get("*", (req, res) => {
            res.sendFile(filePath, (err: any) => {
                if (err) {
                    console.error("Error sending file:", err);
                    res.status(err.status || 500).send(err.message);
                }
            });
        });


        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error setting up server:", error);
    }
}


setUpServer();

//sendFile("index.html, {root: staticDir}}")
