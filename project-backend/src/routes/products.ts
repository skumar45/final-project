import { Express, Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";

export function registerProductRoutes(app: Express, mongoClient: MongoClient) {
    const db = mongoClient.db(process.env.DB_NAME);
    const productsCollection = db.collection("products");


    app.get("/api/products", async (req: Request, res: Response) => {
        try {
            const products = await productsCollection.find().toArray();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch products" });
        }
    });


    app.get("/api/products/:id", async (req: Request, res: Response) => {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                 res.status(400).json({ error: "Invalid product ID" });
            }

            const product = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });
            if (!product)  res.status(404).json({ error: "Product not found" });

            res.json(product);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch product" });
        }
    });


    app.post("/api/products", async (req: Request, res: Response) => {
        try {
            const newProduct = req.body;


            if (!newProduct.name || !newProduct.price || !newProduct.image) {
                 res.status(400).json({ error: "Missing required fields: name, price, or image" });
            }

            const result = await productsCollection.insertOne(newProduct);
            res.status(201).json({ message: "Product added successfully", productId: result.insertedId });
        } catch (error) {
            res.status(500).json({ error: "Failed to add product" });
        }
    });


    app.put("/api/products/:id", async (req: Request, res: Response) => {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                 res.status(400).json({ error: "Invalid product ID" });
            }

            const updatedProduct = req.body;
            const result = await productsCollection.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: updatedProduct }
            );

            if (result.modifiedCount === 0) {
                res.status(404).json({ error: "Product not found or no changes made" });
            }

            res.json({ message: "Product updated successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to update product" });
        }
    });


    app.delete("/api/products/:id", async (req: Request, res: Response) => {
        try {
            if (!ObjectId.isValid(req.params.id)) {
                res.status(400).json({ error: "Invalid product ID" });
            }

            const result = await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });

            if (result.deletedCount === 0) {
               res.status(404).json({ error: "Product not found" });
            }

            res.json({ message: "Product deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete product" });
        }
    });
}
