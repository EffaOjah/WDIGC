const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getAllForms, 
    createForm, 
    toggleFormStatus, 
    deleteForm 
} = require('../controllers/formController');

router.get('/', protect, getAllForms); // Admin view for moderating forms
router.post('/', createForm); // Open public submission portal
router.put('/:id/toggle', protect, toggleFormStatus); // Admin status toggler
router.delete('/:id', protect, deleteForm); // Admin row erasure

module.exports = router;
