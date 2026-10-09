import mongoose from "mongoose";

const ConnectedDataBase = async (): Promise<void> => {
    try{
        const mongoUri= process.env.MONGO_URI

        if(!mongoUri){
            throw new Error("MONGO_URI is not defined in the environment variables");
        }

        await mongoose.connect(mongoUri);

        console.log ("mongoDB connected successfullly");
    }
    catch(error){
        console.error("MongoDB connection failed:", error);
        process.exit(1);// exit the process with falilure code
    }
};

export default ConnectedDataBase;