import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'],
        index: true
    },
    projectType: {
        type: Schema.Types.ObjectId,
        ref: "ProjectType",
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

messageSchema.index({ email: 1, createdAt: -1 });

const Message = model("Message", messageSchema);

export default Message;