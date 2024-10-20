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
// POST endpoint to handle file uploads
exports.createData = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            // ... error handling
        }

        const fileTitle = req.body.fileTitle?.trim();
        const uploadedFile = req.file;

        if (!fileTitle || !uploadedFile) {
            return res.status(400).json({ message: 'يرجى التأكد من إدخال عنوان الملف واختيار ملف.' });
        }

        try {
            const relativePath = path.relative(process.cwd(), uploadedFile.path);
            const newData = {
                fileTitle,
                uploadedFile: relativePath 
            };

            const dbData = await Data.create(newData);

            // Return the stored data, including the file content
            const fileContent = fs.readFileSync(uploadedFile.path); // Read file content
            const base64File = fileContent.toString('base64'); // Convert to base64 for frontend use

            res.status(200).json({ 
                message: 'تم تحميل الملف بنجاح', 
                data: { 
                    fileTitle: dbData.fileTitle, 
                    uploadedFile: base64File // Send file as base64
                } 
            });
        } catch (error) {
            console.error('Error creating data:', error);
            res.status(500).json({ message: 'خطأ في قاعدة البيانات: ' + error.message });
        }
    });
};




// get
// GET endpoint to retrieve uploaded files
exports.getData = async (req, res) => {
    try {
        // Fetch all records from the database
        const dataRecords = await Data.find(); // Assuming Data is your Mongoose model

        // If no records are found, return an empty array
        if (!dataRecords || dataRecords.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'لا توجد ملفات تم تحميلها بعد.', 
                data: [] // Consistent response structure
            });
        }

        // Return the retrieved records
        res.status(200).json({ 
            success: true, 
            message: 'تم استرجاع الملفات بنجاح', 
            data: dataRecords 
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'خطأ في قاعدة البيانات: ' + error.message 
        });
    }
};
