import express from "express";
import { checkValidURL } from "./checkValidURL";
import { getRandomString } from "./getRandomString"
import { insertURL, checkDuplicate, matchCodeToURL } from "./dbHandler"

const app = express();

app.get('/', (req: any, res: any) => {
    console.log('Traffic on / ')
    res.send('Hello World')
})

app.get('/:code', async (req, res) => {
    console.log("Traffic on code route")
    const shortCode = req.params.code
    const matchFound = await matchCodeToURL(shortCode)

    if(matchFound){
    res.status(201).redirect(matchFound.originalUrl)
    } else {
        res.status(500).send("No matching URL found.")
    }
})

app.post('/main', async (req, res) => {
    // Add error checking 

    // Check url is valid 
    const urlValue: any = req.query.url
    const isValid: boolean = checkValidURL(urlValue);
    console.log(isValid)

    // Generate a short url
    const randomID: string = getRandomString(10) // Length of ID 
    console.log(randomID)

    // Check for duplicate URL
    const duplicateCode = await checkDuplicate(urlValue)
    if (duplicateCode) {
        res.status(200).send("URL already exists, short code: " + duplicateCode)
    } else {
        // Return the code if the write operation was sucessful
        const writeComplete = await insertURL(urlValue, randomID)
        console.log("Write complete: " + writeComplete)
        if (writeComplete) {
            res.status(200).send("Your code is: " + randomID)
        } else {
            res.status(500).send("Error writing to database")
        }
    }
})

app.listen(8000, () => console.log('Server is running on port 8000'));