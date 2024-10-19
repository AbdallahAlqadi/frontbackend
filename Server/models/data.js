const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    fileTitle: { type: String, required: true },
    uploadedFile: { type: String, required: true } // Ensure this field matches what you're trying to save
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
