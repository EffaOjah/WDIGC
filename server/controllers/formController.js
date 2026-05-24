const Form = require('../models/formModel');

const getAllForms = async (req, res) => {
    try {
        const forms = await Form.getAll();
        res.status(200).json({ success: true, data: forms });
    } catch (error) {
        console.error("Error in getAllForms:", error);
        res.status(500).json({ success: false, message: "Error fetching growth form records." });
    }
};

const createForm = async (req, res) => {
    try {
        const { category, name, email, contact, type, date_track, details } = req.body;
        
        if (!category || !name || !contact) {
            return res.status(400).json({ success: false, message: "Category, Name, and Contact number are required fields." });
        }
        
        // Generate dynamic unique receipt registration code if not provided
        const regId = req.body.id || `WDIGC-${Math.floor(1000 + Math.random() * 9000)}-REG`;
        
        const formId = await Form.create({
            id: regId,
            category,
            name,
            email,
            contact,
            type,
            date_track,
            details,
            status: 'pending'
        });
        
        res.status(201).json({ success: true, message: "Growth Form submitted successfully", data: { id: formId } });
    } catch (error) {
        console.error("Error in createForm:", error);
        res.status(500).json({ success: false, message: "Error recording registration." });
    }
};

const toggleFormStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Form.toggleStatus(id);
        
        if (!success) {
            return res.status(404).json({ success: false, message: "Form registration record not found." });
        }
        
        // Get updated record for confirmation response
        const updated = await Form.getById(id);
        res.status(200).json({ success: true, message: `Form status updated to ${updated.status}`, data: updated });
    } catch (error) {
        console.error("Error in toggleFormStatus:", error);
        res.status(500).json({ success: false, message: "Error toggling record processing state." });
    }
};

const deleteForm = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Form.delete(id);
        
        if (!success) {
            return res.status(404).json({ success: false, message: "Form registration record not found." });
        }
        
        res.status(200).json({ success: true, message: "Registration record deleted permanently." });
    } catch (error) {
        console.error("Error in deleteForm:", error);
        res.status(500).json({ success: false, message: "Error deleting growth form record." });
    }
};

module.exports = {
    getAllForms,
    createForm,
    toggleFormStatus,
    deleteForm
};
