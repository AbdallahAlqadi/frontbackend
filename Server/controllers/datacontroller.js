const Data = require('../models/data');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// إعداد multer للتعامل مع تحميل الملفات
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/\s+/g, '_').replace(/[^\w-_.]/g, ''); // تطهير اسم الملف
        cb(null, sanitizedFileName);
    }
});

// تصفية أنواع الملفات
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf', // نوع ملف PDF
        'application/vnd.ms-powerpoint', // نوع ملف PPT
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' // نوع ملف PPTX
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('نوع الملف غير مسموح به'), false);
    }
};

// قيود الحجم (5 ميغابايت كحد أقصى)
const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB 
});

// نقطة النهاية POST لمعالجة تحميل الملفات
exports.createData = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(400).json({ message: 'خطأ في تحميل الملف: ' + err.message });
        }

        const fileTitle = req.body.fileTitle; // تأكد من استخدام عنوان الملف بشكل صحيح
        const uploadedFile = req.file; // استخدام req.file للحصول على الملف المرفوع

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

            res.status(200).json({ message: 'تم تحميل الملف بنجاح', data: { fileTitle: dbData.fileTitle, uploadedFile: dbData.uploadedFile } });
        } catch (error) {
            console.error('خطأ أثناء إنشاء البيانات:', error);
            res.status(500).json({ message: error.message });
        }
    });
};
