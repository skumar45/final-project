"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerImageRoutes = registerImageRoutes;
const ImageProvider_1 = require("../ImageProvider");
function registerImageRoutes(app, mongoClient) {
    const imageProvider = new ImageProvider_1.ImageProvider(mongoClient);
    app.get("/api/images", async (req, res) => {
        try {
            let userId = undefined;
            if (typeof req.query.createdBy === "string") {
                userId = req.query.createdBy;
            }
            console.log("Filtering images by user ID:", userId); // Debugging output
            const images = await imageProvider.getAllImages(userId);
            res.json(images); // Send JSON response with image data
        }
        catch (error) {
            console.error("Error fetching images:", error);
            res.status(500).json({ error: "Could not fetch images" });
        }
    });
    app.patch("/api/images/:id", async (req, res) => {
        try {
            const imageId = req.params.id; // Extract the image ID from the URL
            const newName = req.body.name; // Extract the new name from the request body
            if (!newName) {
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing name property"
                });
            }
            console.log("Image ID:", imageId);
            console.log("New name:", newName);
            const matchedCount = await imageProvider.updateImageName(imageId, newName);
            if (matchedCount === 0) {
                res.status(404).send({
                    error: "Not found",
                    message: "Image does not exist"
                });
            }
            res.status(204).end();
        }
        catch (error) {
            console.error("Error processing PATCH request:", error);
            res.status(500).send({ error: "Internal Server Error" });
        }
    });
}
