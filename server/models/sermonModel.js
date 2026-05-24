const db = require('../config/db');

// Self-healing runtime database migration to append any missing fields on boot
const migrate = async () => {
    try {
        // Query columns layout in MySQL
        const [columns] = await db.query('SHOW COLUMNS FROM sermons');
        const existingColumns = columns.map(c => c.Field.toLowerCase());
        
        // Define required columns list
        const requiredColumns = [
            { name: 'speaker', query: "ALTER TABLE sermons ADD COLUMN speaker VARCHAR(100) DEFAULT 'Apostle Omotosho Tope Joseph'" },
            { name: 'sermon_date', query: "ALTER TABLE sermons ADD COLUMN sermon_date VARCHAR(100)" },
            { name: 'scripture', query: "ALTER TABLE sermons ADD COLUMN scripture VARCHAR(100)" },
            { name: 'category', query: "ALTER TABLE sermons ADD COLUMN category VARCHAR(50)" },
            { name: 'audio_path', query: "ALTER TABLE sermons ADD COLUMN audio_path VARCHAR(255)" },
            { name: 'excerpt', query: "ALTER TABLE sermons ADD COLUMN excerpt TEXT" },
            { name: 'transcript', query: "ALTER TABLE sermons ADD COLUMN transcript TEXT" }
        ];
        
        // Check and apply missing table columns
        for (const col of requiredColumns) {
            if (!existingColumns.includes(col.name.toLowerCase())) {
                await db.query(col.query);
                console.log(`[SQL Migration] Added column: '${col.name}' to 'sermons' table successfully.`);
            }
        }
    } catch (e) {
        console.error("[SQL Migration] Self-healing sermon schema upgrade failed:", e.message);
    }
};

// Execute boot migrations
migrate();

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
            `INSERT INTO sermons 
             (title, video_id, thumbnail_path, link, speaker, sermon_date, scripture, category, audio_path, excerpt, transcript) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.title, 
                data.video_id, 
                data.thumbnail_path, 
                data.link, 
                data.speaker, 
                data.sermon_date, 
                data.scripture, 
                data.category, 
                data.audio_path, 
                data.excerpt, 
                data.transcript
            ]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const [result] = await db.query(
            `UPDATE sermons SET 
             title = ?, video_id = ?, thumbnail_path = ?, link = ?, speaker = ?, 
             sermon_date = ?, scripture = ?, category = ?, audio_path = ?, excerpt = ?, transcript = ? 
             WHERE id = ?`,
            [
                data.title, 
                data.video_id, 
                data.thumbnail_path, 
                data.link, 
                data.speaker, 
                data.sermon_date, 
                data.scripture, 
                data.category, 
                data.audio_path, 
                data.excerpt, 
                data.transcript, 
                id
            ]
        );
        return result.affectedRows > 0;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM sermons WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Sermon;
