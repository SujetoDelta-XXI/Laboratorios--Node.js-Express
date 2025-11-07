import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // carga las variables desde .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error.message);
        process.exit(1); // Detiene la app si no conecta
    }
};

export default connectDB;
