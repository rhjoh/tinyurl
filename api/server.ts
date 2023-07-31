import express from "express";
import { checkValidURL } from "./checkValidURL";
import { getRandomString } from "./getRandomString"
import { insertURL, checkDuplicate, matchCodeToURL } from "./dbHandler"

const app = express();

app.get('/', (req: any, res: any) => {
    console.log('Traffic on / ')
    res.send('Hello World')
})

app.post('/main', async (req, res) => {
    console.log("Traffic on main route")

    // Check url is valid 
    const urlValue: any = req.query.url
    const isValid: boolean = checkValidURL(urlValue);
    console.log("Got request for " + urlValue)
    console.log("Is valid: " + isValid)

/*     const nowPlus1Hour = Date.now() + (60 * 60 * 1000) 
    const nowPlus24Hour = Date.now() + (24 * 60 * 60 * 1000) */

    if (isValid) {
        // Generate a short url
        const randomID: string = getRandomString(10) // Length of ID 

        // Check for duplicate URL
        const duplicateCode = await checkDuplicate(urlValue)
        if (duplicateCode) {
            res.status(200).send(duplicateCode)
        } else {
            // Return the code if the write operation was sucessful
            const createdNewRecord = await insertURL(urlValue, randomID) // add expire epoch
            console.log("Inserted:")
            console.log(createdNewRecord)
            if (createdNewRecord) {
                res.status(200).send(createdNewRecord)
            } else {
                res.status(500).send("Error writing to database")
            }
        }

    } else {
        res.status(500).send("Invalid URL")
    }

})
app.get('/:code', async (req, res) => {
    console.log("Traffic on code route")
    const shortCode = req.params.code
    const matchFound = await matchCodeToURL(shortCode)

    if (matchFound) {
        res.status(201).redirect(matchFound.originalUrl)
    } else {
        res.status(500).send("No matching URL found.")
    }
})


app.listen(8012, () => console.log('Server is running on port 8012'));