const { MongoClient } = require('mongodb')

const mongoURI = process.env.MONGO_TINYURL_URI;
const client = new MongoClient(mongoURI)
const collection = client.db("tinyurl").collection("mappings")

export async function checkDuplicate(urlValue: string) {
    try {
        await client.connect();
        const duplicateExistsValue = await collection.findOne({
            originalUrl: urlValue
        })
        console.log(duplicateExistsValue)
        if (duplicateExistsValue) {
            return duplicateExistsValue.shortCode
        } else {
            return false;
        }
    } catch (error) {
        console.log(error)
        return error;
    } finally {
        await client.close()
    }
}

export async function matchCodeToURL(shortCode: string) {

    try {
        await client.connect()
        const foundMatch = await collection.findOne({
            shortCode: shortCode
        })
        console.log(foundMatch)
        return foundMatch;
    } catch (error) {
        console.log(error)
    } finally {
        await client.close()
    }
}

export async function insertURL(urlValue: string, shortCode: string) {
    const mappingObject = {
        originalUrl: urlValue,
        shortCode: shortCode
    }

    try {
        await client.connect()
        await collection.insertOne({
            originalUrl: mappingObject.originalUrl,
            shortCode: mappingObject.shortCode
        })
        return true;
    } catch (error) {
        console.log(error)
        return error;
    } finally {
        await client.close()
    }
}



