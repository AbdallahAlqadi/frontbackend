const Data = require('../models/data');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Sanitize filename and add timestamp to avoid duplicates
        const sanitizedFileName = file.originalname.replace(/\s+/g, '_').replace(/[^\w-_.]/g, '');
        const fileExt = path.extname(sanitizedFileName);
        const fileNameWithoutExt = path.basename(sanitizedFileName, fileExt);
        const uniqueFileName = `${fileNameWithoutExt}_${Date.now()}${fileExt}`;
        cb(null, uniqueFileName);
    }
});

// Size limit (5 MB max)
const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB 
});

// POST endpoint to handle file uploads
exports.createData = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(400).json({ message: 'خطأ في تحميل الملف: ' + err.message });
            } else {
                // An unknown error occurred when uploading.
                return res.status(400).json({ message: 'خطأ غير معروف في تحميل الملف: ' + err.message });
            }
        }

        const fileTitle = req.body.fileTitle?.trim(); // Ensure proper use of file title
        const uploadedFile = req.file; // Use req.file to get the uploaded file

        if (!fileTitle || !uploadedFile) {
            return res.status(400).json({ message: 'يرجى التأكد من إدخال عنوان الملف واختيار ملف.' }); // Ensure title and file are provided
        }

        try {
            const relativePath = path.relative(process.cwd(), uploadedFile.path);
            const newData = {
                fileTitle,
                uploadedFile: relativePath 
            };

            const dbData = await Data.create(newData);

            res.status(200).json({ message: 'تم تحميل الملف بنجاح', data: { fileTitle: dbData.fileTitle, uploadedFile: dbData.uploadedFile } });
        } catch (error) {
            console.error('Error creating data:', error);
            res.status(500).json({ message: 'خطأ في قاعدة البيانات: ' + error.message });
        }
    });
};
