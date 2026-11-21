import mongoose from "mongoose";

export async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const connect = mongoose.connection;

        connect.on("connected", () => {
            console.log("MongoDB has successfully connected");
        });

        connect.on("error", () => {
            console.log("MongoDB failed to connect");
            process.exit(1);
        });

    } catch (error) {
        console.log("Failed to connect to MongoDB!!");
        console.log(error instanceof Error ? error.message : error);
    }
}
