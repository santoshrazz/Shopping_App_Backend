import mongoose from 'mongoose'

const connectionURI = process.env.connectionURI || `mongodb://127.0.0.1:27017/myShopping`;
const connectToDb = async () => {
    if (!connectionURI) {
        throw new Error("No Db connection string found");
    }
    const connectionInstance = await mongoose.connect(connectionURI);
}
export { connectToDb }