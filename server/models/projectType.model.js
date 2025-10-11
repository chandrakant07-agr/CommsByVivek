import { Schema, model } from "mongoose";

const projectTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
}, { timestamps: true });

const ProjectType = model("ProjectType", projectTypeSchema);

export default ProjectType;