import logger from "../../utils/logger.js";
import upload from "./uploads.services.js";



const uploadFileController = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    
    // Convert backslashes to forward slashes and build absolute URL
    const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
    
    res.status(200).json({ 
        success: true, 
        message: "File uploaded successfully", 
        data: {
            url: fileUrl,
            publicId: req.file.filename
        } 
    });

};

export { uploadFileController };
