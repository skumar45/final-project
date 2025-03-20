import { MongoClient, ObjectId, Collection, Filter, UpdateResult } from "mongodb";

export class ImageProvider {
    private imagesCollection: Collection<Image>;
    private usersCollection: Collection<User>;

    constructor(private readonly mongoClient: MongoClient) {
        const imagesCollectionName = process.env.IMAGES_COLLECTION_NAME;
        const usersCollectionName = process.env.USERS_COLLECTION_NAME; // Add users collection name

        if (!imagesCollectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME from environment variables");
        }
        if (!usersCollectionName) {
            throw new Error("Missing USERS_COLLECTION_NAME from environment variables");
        }

        this.imagesCollection = this.mongoClient.db().collection<Image>(imagesCollectionName);
        this.usersCollection = this.mongoClient.db().collection<User>(usersCollectionName); // Initialize users collection
    }

    async getAllImages(authorId?: string): Promise<DenormalizedImage[]> {
        let filter: Filter<Image> = {};
        if (authorId) {
            filter = { author: authorId };
        }
        const images = await this.imagesCollection.find(filter).toArray();
        const denormalizedImages: DenormalizedImage[] = await Promise.all(
            images.map(async (image) => {
                const user = await this.usersCollection.findOne({ _id: image.author}); // Assuming author is _id
                return {
                    ...image,
                    author: user || { _id: image.author, username: "Unknown", email: "unknown" }, // Fallback if user not found.
                };
            })
        );
        return denormalizedImages;
    }

    async updateImageName(imageId: string, newName: string): Promise<number> {
        try {
            const updateResult: UpdateResult = await this.imagesCollection.updateOne(
                { _id: imageId },
                { $set: { name: newName } }
            );
            return updateResult.matchedCount;
        } catch (error) {
            console.error("Error updating image name:", error);
            return 0; // Or throw an error if you want to propagate it
        }
    }
}

interface Image {
    _id: string;
    src: string;
    name: string;
    author: string; // Now this is the author's _id
    likes: number;
}

interface User {
    _id: string;
    username: string;
    email: string;
}

interface DenormalizedImage extends Omit<Image, "author"> {
    author: User;
}