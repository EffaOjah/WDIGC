const db = require('../config/db');

const Sermon = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM sermons ORDER BY created_at DESC');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM sermons WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const [result] = await db.query(
            'INSERT INTO sermons (title, video_id, thumbnail_path, link) VALUES (?, ?, ?, ?)',
            [data.title, data.video_id, data.thumbnail_path, data.link]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const [result] = await db.query(
            'UPDATE sermons SET title = ?, video_id = ?, thumbnail_path = ?, link = ? WHERE id = ?',
            [data.title, data.video_id, data.thumbnail_path, data.link, id]
        );
        return result.affectedRows > 0;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM sermons WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Sermon;
