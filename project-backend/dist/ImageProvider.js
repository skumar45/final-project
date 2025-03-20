"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProvider = void 0;
class ImageProvider {
    mongoClient;
    imagesCollection;
    usersCollection;
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const imagesCollectionName = process.env.IMAGES_COLLECTION_NAME;
        const usersCollectionName = process.env.USERS_COLLECTION_NAME; // Add users collection name
        if (!imagesCollectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }
        if (!usersCollectionName) {
            throw new Error("Missing USERS_COLLECTION_NAME from environment variables");
        }
        this.imagesCollection = this.mongoClient.db().collection(imagesCollectionName);
        this.usersCollection = this.mongoClient.db().collection(usersCollectionName); // Initialize users collection
    }
    async getAllImages(authorId) {
        let filter = {};
        if (authorId) {
            filter = { author: authorId };
        }
        const images = await this.imagesCollection.find(filter).toArray();
        const denormalizedImages = await Promise.all(images.map(async (image) => {
            const user = await this.usersCollection.findOne({ _id: image.author }); // Assuming author is _id
            return {
                ...image,
                author: user || { _id: image.author, username: "Unknown", email: "unknown" }, // Fallback if user not found.
            };
        }));
        return denormalizedImages;
    }
    async updateImageName(imageId, newName) {
        try {
            const updateResult = await this.imagesCollection.updateOne({ _id: imageId }, { $set: { name: newName } });
            return updateResult.matchedCount;
        }
        catch (error) {
            console.error("Error updating image name:", error);
            return 0; // Or throw an error if you want to propagate it
        }
    }
}
exports.ImageProvider = ImageProvider;
