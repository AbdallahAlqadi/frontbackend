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
exports.createData = upload.single('videoFile'), async (req, res) => {
    const videoTitle = req.body.videoTitle; // Access video title
    const videoFile = req.file; // Access uploaded video file

    // Check if the file is uploaded
    if (!videoFile) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const newData = {
            videoTitle,
            videoFile: videoFile.path // Save the path of the file in the database
        };

        console.log('New Data:', newData); // Log the new data for debugging

        const dbData = await Data.create(newData); // Save to the database

        res.status(200).json({ message: `User created successfully: ${dbData}` });
    } catch (error) {
        console.error('Error while creating data:', error); // Log the error for debugging
        res.status(500).json({ message: error.message }); // Return a 500 error response
    }
};
