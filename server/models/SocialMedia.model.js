import { Schema, model } from "mongoose";

const socialMediaSchema = new Schema({
    platform: {
        type: String,
        required: true,
        enum: ['Arattai', 'Facebook', 'Instagram', 'LinkedIn', 'Pinterest', 'Twitter',
            'YouTube', 'Website', 'Whatsapp']
    },
    url: {
        type: String,
        required: true
    }
}, { timestamps: true });

const SocialMedia = model("SocialMedia", socialMediaSchema);

export default SocialMedia;