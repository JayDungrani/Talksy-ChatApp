import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (req, res) => {
    try {
        const { photoId } = req.body;
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // Convert file buffer to a base64-encoded string
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        // Upload image to Cloudinary
        let uploadResult;
        if(photoId){
            uploadResult = await cloudinary.uploader.upload(base64Image, {
                folder: "profile_pictures",
                public_id: `profile_${photoId}`,
                overwrite: true,
                transformation: [
                    { width: 500, height: 500, crop: "auto", gravity: "auto" }
                ]
            });
        }
        else{
            uploadResult = await cloudinary.uploader.upload(base64Image, {
                folder: "profile_pictures",
                overwrite: true,
                transformation: [
                    { width: 500, height: 500, crop: "auto", gravity: "auto" }
                ]
            });
        }

        res.status(200).json(uploadResult.secure_url);

    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
