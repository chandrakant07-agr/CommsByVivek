import { Schema, model } from "mongoose";

const contactDetailsSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address.']
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^(\+?\d{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{2,4}[\s-]?\d{4,5}|\d{10})$/,
                'Please enter a valid phone number.']
    },
    address: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const ContactDetails = model("ContactDetail", contactDetailsSchema);

export default ContactDetails;