import mongoose from "mongoose"

export async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!)
        const connect = mongoose.connection

        connect.on('connected', () => {
            console.log("MongoDB has succesfully connected")
        })

        connect.on('error', (err) => {
            console.log("MongoDB failed to connect")
            process.exit(1)
        })

    } catch (error: any) {
        console.log("Failed to connect to MongoDB!!")
        console.log(error)
    }
}