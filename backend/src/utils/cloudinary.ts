import cloudinary from "../config/cloudinary.js";
import { UploadApiResponse } from "cloudinary";

export const uploadImage = ( buffer: Buffer, folder: string): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder, resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!result) {
                    reject(new Error("Cloudinary upload failed"));
                    return;
                }

                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

export const deleteImage = async ( publicId: string): Promise<void> => {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
};