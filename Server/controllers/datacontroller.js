const Data = require('../models/data');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// إعداد multer لرفع الملفات
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/\s+/g, '_').replace(/[^\w-_.]/g, '');
        const uniqueFileName = `${Date.now()}_${sanitizedFileName}`;
        cb(null, uniqueFileName);
    }
});

// حجم الملف الأقصى (5 ميجابايت)
const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB 
});

// POST endpoint لمعالجة رفع الملفات
exports.createData = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'خطأ أثناء رفع الملف: ' + err.message });
        }

        const fileTitle = req.body.fileTitle?.trim();
        const uploadedFile = req.file;

        if (!fileTitle || !uploadedFile) {
            return res.status(400).json({ message: 'يرجى التأكد من إدخال عنوان الملف واختيار ملف.' });
        }

        try {
            const newData = {
                fileTitle,
                uploadedFile: uploadedFile.path // حفظ مسار الملف
            };

            const dbData = await Data.create(newData);

            res.status(200).json({ 
                message: 'تم تحميل الملف بنجاح', 
                data: dbData // إرسال البيانات المخزنة
            });
        } catch (error) {
            console.error('Error creating data:', error);
            res.status(500).json({ message: 'خطأ في قاعدة البيانات: ' + error.message });
        }
    });
};

// GET endpoint لاسترجاع الملفات المرفوعة
exports.getData = async (req, res) => {
    try {
        const dataRecords = await Data.find(); // جلب كافة السجلات من قاعدة البيانات

        if (!dataRecords || dataRecords.length === 0) {
            return res.status(404).json({ success: false, message: 'لا توجد ملفات تم تحميلها بعد.', data: [] });
        }

        res.status(200).json({ success: true, message: 'تم استرجاع الملفات بنجاح', data: dataRecords });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ success: false, message: 'خطأ في قاعدة البيانات: ' + error.message });
    }
};
