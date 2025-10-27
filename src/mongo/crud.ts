import { connectToMongo } from './connections.js';

export const createOne = async (collectionName: string, document: any) => {
    try {
        const db = await connectToMongo();

        const collection = db.collection(collectionName);

        const result = await collection.insertOne(document);

        return result

    } catch (error) {
        console.error(error);
        throw new Error('Failed to update one document');
    } 
}    

export const createMany = async (collectionName: string, documents: any[]) => {
    try {
        const db = await connectToMongo();
        const collection = db.collection(collectionName);
        const result = await collection.insertMany(documents);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create many documents");
    }
}

export const updateOne = async (collectionName: string, filter: any, update: any) => {
    try {
        const db = await connectToMongo();
        const collection = db.collection(collectionName);
        const result = await collection.updateOne(filter, update);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update one document");
    }
}

export const updateMany = async (collectionName: string, filter: any, update: any) => {
    try {
        const db = await connectToMongo();
        const collection = db.collection(collectionName);
        const result = await collection.updateMany(filter, update);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update many documents");
    }
}

export const deleteOne = async (collectionName: string, filter: any) => {
    try {
        const db = await connectToMongo();
        const collection = db.collection(collectionName);
        const result = await collection.deleteOne(filter);            
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete one document");
    }
}

export const deleteMany = async (collectionName: string, filter: any) => {
    try {
        const db = await connectToMongo();
        const collection = db.collection(collectionName);
        const result = await collection.deleteMany(filter);         
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete many documents");
    }
}

export const findOne = async (collectionName: string, filter: any) => {
    try {
        const db = await connectToMongo();
        const collection = db.collection(collectionName);
        const result = await collection.findOne(filter);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to find one document");
    }
}

export const findMany = async (collectionName: string, filter: any) => {
    try {
        const db = await connectToMongo();
        const collection = db.collection(collectionName);
        const cursor = collection.find(filter);
        const results = await cursor.toArray();
        return results;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to find documents");
    }
}       



    