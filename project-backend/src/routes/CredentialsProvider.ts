import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;
    private readonly SALT_ROUNDS = 10;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }

    async registerUser(username: string, plaintextPassword: string): Promise<boolean> {
        try {

            const existingUser = await this.collection.findOne({ username });
            if (existingUser) {
                return false; 
            }


            const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
            const hashedPassword = await bcrypt.hash(plaintextPassword, salt);

          
            console.log("Salt:", salt);
            console.log("Hash:", hashedPassword);


            await this.collection.insertOne({
                username,
                password: hashedPassword, 
            });

            return true; 
        } catch (error) {
            console.error("Error registering user:", error);
            return false; 
        }
    }

    async verifyPassword(username: string, plaintextPassword: string): Promise<boolean>{
        try {

            const user = await this.collection.findOne({ username });
            if (!user) {
                return false; 
            }

            return await bcrypt.compare(plaintextPassword, user.password);
        } catch (error) {
            console.error("Error verifying password:", error);
            return false; 
        }
    }
}
