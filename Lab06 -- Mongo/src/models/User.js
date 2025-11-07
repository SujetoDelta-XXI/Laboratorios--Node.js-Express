import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },

    age: { type: Number, required: true, min: 18 },
    phoneNumber: { type: String },
    password: { type: String, required: true, minlength: 8 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
