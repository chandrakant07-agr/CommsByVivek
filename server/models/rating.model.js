import { Schema, model } from "mongoose";

const ratingSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: "Gallery",   // refer gallery model
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    status: {
        type: String,
        enum: ["pending", "submitted", "approved"],
        default: "pending"
    },
    clientName: {
        type: String,
        trim: true,
        index: true
    },
    clientCompany: {
        type: String,
        trim: true
    },
    testimonial: {
        type: String,
        trim: true,
        vaidate: [(val) => val.length <= 200, "Testimonial cannot exceed 200 characters."]
    },
    overallRating: {
        type: Number,
        min: 1,
        max: 5
    },
    parameterRatings: {
        communication: { type: Number, min: 0, max: 5 },
        timelyDelivery: { type: Number, min: 0, max: 5 },
        cinematography: { type: Number, min: 0, max: 5 },
        creativeVision: { type: Number, min: 0, max: 5 }
    },
    submittedAt: { type: Date  },
    approvedAt: { type: Date  }
}, { timestamps: true });

ratingSchema.index({ project: 1, clientName: 1, createdAt: -1 });

const Rating = model("Rating", ratingSchema);

export default Rating;