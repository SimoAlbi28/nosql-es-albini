// connection:

import { MongoClient } from "mongodb";

export const connectToMongo = async () => {
    const mongoUri = process.env.MONGO_URL;
    if(!mongoUri) {
        throw new Error("MONGO_URI is not set");
    }

    const dbName = process.env.MONGO_DB_NAME;
    if (!dbName) {
        throw new Error("MONGO_DB_NAME is not set");
    }

    try{
        // Iizializzo il client di MongoDB
     const client = new MongoClient(mongoUri, {
        maxPoolSize: 10,
     });

     // Connetto il client al server MongoDB
     const connection = await client.connect();

     // Ottengo il db
     const db = connection.db(dbName);

     return db;

    }
    catch (error) {
        console.error("Error connecting to MongoDB", error);
        throw error;
    }
}