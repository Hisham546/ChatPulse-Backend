import mongoose from "mongoose"

export const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongo db connected : ${conn.connection.host}`);
    } catch (error) {
        console.log(error,'.............mongodb error')
        process.exit(1) // 1 means error 0 means success

    }
}