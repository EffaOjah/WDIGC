const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { getAllSermons, createSermon, deleteSermon } = require('../controllers/sermonController');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', getAllSermons);
router.post('/', protect, upload.single('thumbnail'), createSermon);
router.delete('/:id', protect, deleteSermon);

module.exports = router;
