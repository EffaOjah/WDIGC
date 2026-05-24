const Testimony = require('../models/testimonyModel');

const getAllTestimonies = async (req, res) => {
    try {
        const testimonies = await Testimony.getAll();
        res.status(200).json({ success: true, data: testimonies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getApprovedTestimonies = async (req, res) => {
    try {
        const testimonies = await Testimony.getApproved();
        res.status(200).json({ success: true, data: testimonies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createTestimony = async (req, res) => {
    try {
        const { name, location, category, category_text, scripture, text, initials, date_text, status } = req.body;
        
        // Derive initials if not provided
        let derivedInitials = initials;
        if (!derivedInitials && name) {
            derivedInitials = name.split(" ")
                                  .map(n => n[0])
                                  .join("")
                                  .substring(0, 2)
                                  .toUpperCase();
        }
        
        const testimonyId = await Testimony.create({ 
            name, 
            location, 
            category, 
            category_text: category_text || (category ? category.charAt(0).toUpperCase() + category.slice(1) : ''), 
            scripture, 
            text, 
            initials: derivedInitials || 'EH', 
            date_text: date_text || 'Just now',
            status: status || 'pending'
        });
        
        res.status(201).json({ success: true, data: { id: testimonyId, name } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleTestimonyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Testimony.toggleStatus(id);
        if (success) {
            res.status(200).json({ success: true, message: 'Testimony status toggled successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Testimony not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteTestimony = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Testimony.delete(id);
        if (deleted) {
            res.status(200).json({ success: true, message: 'Testimony deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Testimony not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllTestimonies,
    getApprovedTestimonies,
    createTestimony,
    toggleTestimonyStatus,
    deleteTestimony
};
