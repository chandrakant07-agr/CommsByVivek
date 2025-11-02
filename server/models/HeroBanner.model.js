import { Schema, model } from "mongoose";

const heroBannerSchema = new Schema({
    cloudinaryData: {
        public_id: { type: String, required: true, unique: true },
        secure_url: { type: String, required: true },
        resource_type: { type: String, enum: ["image", "video"], required: true },
        format: { type: String, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        bytes: { type: Number, required: true },
        version: { type: Number, required: true },
        duration: { type: Number }, // duration will be present only for videos
        created_at: { type: Date, required: true }
    },
}, { timestamps: true });

const HeroBanner = model("HeroBanner", heroBannerSchema);

export default HeroBanner;
