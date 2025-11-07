import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        enum: ['user', 'admin'] 
    }
}, { timestamps: true });

export default mongoose.model('Role', RoleSchema);
