const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

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

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', protect, upload.single('thumbnail'), createEvent);
router.put('/:id', protect, upload.single('thumbnail'), updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
