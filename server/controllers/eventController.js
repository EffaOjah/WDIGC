const Event = require('../models/eventModel');

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.getAll();
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const { tag, title, date_text, time_text, location, short_desc, long_desc, blessing, event_date } = req.body;
        
        // Extract uploaded single file path if present
        const image_path = req.file ? req.file.path : null;
        
        const eventId = await Event.create({ 
            tag, 
            title, 
            date_text, 
            time_text, 
            location, 
            short_desc, 
            long_desc, 
            blessing, 
            image_path,
            event_date: event_date || date_text
        });
        
        res.status(201).json({ success: true, data: { id: eventId, title } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Event.delete(id);
        if (deleted) {
            res.status(200).json({ success: true, message: 'Event deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllEvents,
    createEvent,
    deleteEvent
};
