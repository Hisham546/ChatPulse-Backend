import storage from '../helpers/storageConfig.js';
import cloudinary from '../helpers/storageConfig.js';
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() });




export async function uploadImages(req, res) {
   
    try {
        // Multer provides the file in req.file
        const file = req.file;
        if (!file) {
            return res.status(400).json({ status: false, message: 'No file provided' });
        }

        // Upload file buffer to Cloudinary
        cloudinary.uploader.upload_stream(
            { public_id: 'images' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.status(500).json({ status: false, message: 'Upload failed' });
                }
                res.status(200).json({ status: true, data: result.url });
            }
        ).end(file.buffer); // Stream the file buffer to Cloudinary
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ status: false, message: error.message });
    }
}
