import logger from "../../utils/logger.js";
import upload from "./uploads.services.js";



const uploadFileController = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({ message: "File uploaded successfully", file: req.file });

};

export { uploadFileController };
