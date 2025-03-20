"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsProvider = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class CredentialsProvider {
    collection;
    SALT_ROUNDS = 10;
    constructor(mongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection(COLLECTION_NAME);
    }
    async registerUser(username, plaintextPassword) {
        try {
            const existingUser = await this.collection.findOne({ username });
            if (existingUser) {
                return false;
            }
            const salt = await bcrypt_1.default.genSalt(this.SALT_ROUNDS);
            const hashedPassword = await bcrypt_1.default.hash(plaintextPassword, salt);
            console.log("Salt:", salt);
            console.log("Hash:", hashedPassword);
            await this.collection.insertOne({
                username,
                password: hashedPassword,
            });
            return true;
        }
        catch (error) {
            console.error("Error registering user:", error);
            return false;
        }
    }
    async verifyPassword(username, plaintextPassword) {
        try {
            const user = await this.collection.findOne({ username });
            if (!user) {
                return false;
            }
            return await bcrypt_1.default.compare(plaintextPassword, user.password);
        }
        catch (error) {
            console.error("Error verifying password:", error);
            return false;
        }
    }
}
exports.CredentialsProvider = CredentialsProvider;
