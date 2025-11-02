import { Schema, model } from "mongoose";

const gallerySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true
    },
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
    shortDescription: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
    },
    pageLocation: {
        type: String,
        enum: ["portfolio", "filmedByVivek"],
        default: "portfolio"
    },
    subTags: {
        type: [String],
        default: [],
        validate: [(val) => val.length <= 3, "Maximum of 3 subTags are allowed."]
    }
}, { timestamps: true });

const Gallery = model("Gallery", gallerySchema);

export default Gallery;