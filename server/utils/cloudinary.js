import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadOnCloudinary = (filePath, folder) => {
    if(!filePath) throw new Error("File path is required for upload");
    if(!folder) throw new Error("Folder name is required");

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(filePath, {
            folder,
            resource_type: "auto",      // to support both image and video uploads
            chunk_size: 20_000_000      // 20 MB
        }, (error, result) => {
            if (error) {
                fs.unlinkSync(filePath); // Delete the local file in case of error
                reject(error);
            } else {
                fs.unlinkSync(filePath); // Delete the local file after successful upload
                resolve(result);
            }
        });
    });
};

export default uploadOnCloudinary;