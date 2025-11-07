import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 30 },
    content: { type: String, required: true, minlength: 10 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    hashtags: [{ type: String }],
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default mongoose.model("Post", postSchema);
