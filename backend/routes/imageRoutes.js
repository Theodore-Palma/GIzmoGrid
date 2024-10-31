const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinaryConfig');

// Image upload route
router.post('/upload', upload.single('image'), (req, res) => {
  // Convert file buffer to base64 string
  const fileBuffer = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  // Upload to Cloudinary
  cloudinary.uploader.upload(fileBuffer, { upload_preset: 'ruen0aeg' }, function(err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error uploading to Cloudinary"
      });
    }
    res.status(200).json({
      success: true,
      message: "File uploaded successfully to Cloudinary",
      data: result
    });
  });
});

module.exports = router;
