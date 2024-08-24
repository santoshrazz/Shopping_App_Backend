import { app } from './app.js'
import dotenv from 'dotenv'
import { connectToDb } from './db_Cofig/connectDb.js'

dotenv.config()

const PORT = process.env.PORT || 8080;

connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Listining on port ${PORT}`);
    })
}).catch((err) => {
    console.log(err);
    throw new Error("Error while connection To Database");
})
