const Sermon = require('../models/sermonModel');

const getAllSermons = async (req, res) => {
    try {
        const sermons = await Sermon.getAll();
        res.status(200).json({ success: true, data: sermons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createSermon = async (req, res) => {
    try {
        const { title, video_id, link } = req.body;
        const thumbnail_path = req.file ? req.file.path : null;
        
        const sermonId = await Sermon.create({ title, video_id, thumbnail_path, link });
        res.status(201).json({ success: true, data: { id: sermonId, title } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteSermon = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Sermon.delete(id);
        if (deleted) {
            res.status(200).json({ success: true, message: 'Sermon deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Sermon not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllSermons,
    createSermon,
    deleteSermon
};
