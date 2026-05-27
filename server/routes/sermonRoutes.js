const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { getAllSermons, getSermonById, createSermon, updateSermon, deleteSermon } = require('../controllers/sermonController');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', getAllSermons);
router.get('/:id', getSermonById);
router.post('/', protect, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), createSermon);
router.put('/:id', protect, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), updateSermon);
router.delete('/:id', protect, deleteSermon);

module.exports = router;
