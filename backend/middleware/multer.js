import multer from "multer";
import fs from "fs";
import path from "path";

// Create uploads folder if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, uploadDir);
    },
    filename: function(req, file, callback) {
        // Add timestamp to avoid filename conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage });

export default upload;