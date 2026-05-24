const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getAllTestimonies, 
    getApprovedTestimonies, 
    createTestimony, 
    toggleTestimonyStatus, 
    deleteTestimony 
} = require('../controllers/testimonyController');

router.get('/', protect, getAllTestimonies); // admin moderation registry
router.get('/approved', getApprovedTestimonies); // public visitor grid
router.post('/', createTestimony); // public submission form and admin addition
router.put('/:id/toggle', protect, toggleTestimonyStatus); // admin moderation approve/unapprove
router.delete('/:id', protect, deleteTestimony); // admin moderation delete

module.exports = router;
