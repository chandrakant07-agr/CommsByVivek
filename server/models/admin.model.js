import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long.']
    },
    role: {
        type: String,
        default: "Admin"
    },
    lastLogin: {
        type: Date,
        default: null
    },
    passwordUpdatedAt: {
        type: Date,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        this.passwordUpdatedAt = new Date();
        next();
    } catch (err) {
        next(err);
    }
});

adminSchema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const Admin = model("Admin", adminSchema);

export default Admin;