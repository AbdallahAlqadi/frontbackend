const Data = require('../models/data');
const multer = require('multer');
const path = require('path');

// Set up multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads'); // Adjust this as needed
        cb(null, uploadPath); // Save to uploads folder
    },
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/\s+/g, '_'); // Replace spaces with underscores
        cb(null, sanitizedFileName); // Use the sanitized filename
    }
});

const upload = multer({ storage });

// POST endpoint to handle video upload
exports.createData = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(400).json({ message: 'خطأ في تحميل الملف: ' + err.message });
        }

        const fileTitle = req.body.fileTitle; // الوصول إلى عنوان الملف
        const uploadedFile = req.file; // الوصول إلى الملف المرفوع

        if (!fileTitle || !uploadedFile) {
            return res.status(400).json({ message: 'يرجى التأكد من إدخال عنوان الملف واختيار ملف.' });
        }

        try {
            const relativePath = path.relative(process.cwd(), uploadedFile.path); 

            const newData = {
                fileTitle,
                uploadedFile: relativePath 
            };

            const dbData = await Data.create(newData); // Save in the database

            res.status(200).json({ message: 'تم إنشاء المستخدم بنجاح', data: { fileTitle: dbData.fileTitle,uploadedFile:dbData.uploadedFile } });
        } catch (error) {
            console.error('خطأ أثناء إنشاء البيانات:', error);
            res.status(500).json({ message: error.message });
        }
    });
};
