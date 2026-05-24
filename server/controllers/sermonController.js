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
        const { title, video_id, link, speaker, sermon_date, scripture, category, excerpt, transcript } = req.body;
        
        // Extract multi-file paths if uploaded
        const thumbnail_path = req.files && req.files.thumbnail ? req.files.thumbnail[0].path : null;
        const audio_path = req.files && req.files.audio ? req.files.audio[0].path : null;
        
        const sermonId = await Sermon.create({ 
            title, 
            video_id, 
            thumbnail_path, 
            link, 
            speaker: speaker || 'Apostle Omotosho Tope Joseph', 
            sermon_date, 
            scripture, 
            category, 
            audio_path, 
            excerpt, 
            transcript 
        });
        
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
