import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
}, { timestamps: true });

const Category = model("Category", categorySchema);

export default Category;