const db = require('../config/db');

// Self-healing runtime database migration to append any missing fields on boot
const migrate = async () => {
    try {
        // Create events table if it does not exist at all
        await db.query(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tag VARCHAR(50),
                title VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Query columns layout in MySQL for the events table
        const [columns] = await db.query('SHOW COLUMNS FROM events');
        const existingColumns = columns.map(c => c.Field.toLowerCase());
        
        // Define required columns list
        const requiredColumns = [
            { name: 'tag', query: "ALTER TABLE events ADD COLUMN tag VARCHAR(50)" },
            { name: 'title', query: "ALTER TABLE events ADD COLUMN title VARCHAR(255) NOT NULL" },
            { name: 'date_text', query: "ALTER TABLE events ADD COLUMN date_text VARCHAR(100)" },
            { name: 'time_text', query: "ALTER TABLE events ADD COLUMN time_text VARCHAR(100)" },
            { name: 'location', query: "ALTER TABLE events ADD COLUMN location VARCHAR(255)" },
            { name: 'short_desc', query: "ALTER TABLE events ADD COLUMN short_desc TEXT" },
            { name: 'long_desc', query: "ALTER TABLE events ADD COLUMN long_desc TEXT" },
            { name: 'blessing', query: "ALTER TABLE events ADD COLUMN blessing TEXT" },
            { name: 'image_path', query: "ALTER TABLE events ADD COLUMN image_path VARCHAR(255)" },
            { name: 'event_date', query: "ALTER TABLE events ADD COLUMN event_date VARCHAR(100)" }
        ];
        
        // Check and apply missing table columns
        for (const col of requiredColumns) {
            if (!existingColumns.includes(col.name.toLowerCase())) {
                await db.query(col.query);
                console.log(`[SQL Migration] Added column: '${col.name}' to 'events' table successfully.`);
            }
        }
    } catch (e) {
        console.error("[SQL Migration] Self-healing event schema upgrade failed:", e.message);
    }
};

// Execute boot migrations
migrate();

const Event = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM events ORDER BY created_at DESC');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const [result] = await db.query(
            `INSERT INTO events 
             (tag, title, date_text, time_text, location, short_desc, long_desc, blessing, image_path, event_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.tag, 
                data.title, 
                data.date_text, 
                data.time_text, 
                data.location, 
                data.short_desc, 
                data.long_desc, 
                data.blessing, 
                data.image_path, 
                data.event_date
            ]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const [result] = await db.query(
            `UPDATE events SET 
             tag = ?, title = ?, date_text = ?, time_text = ?, location = ?, 
             short_desc = ?, long_desc = ?, blessing = ?, image_path = ?, event_date = ? 
             WHERE id = ?`,
            [
                data.tag, 
                data.title, 
                data.date_text, 
                data.time_text, 
                data.location, 
                data.short_desc, 
                data.long_desc, 
                data.blessing, 
                data.image_path, 
                data.event_date, 
                id
            ]
        );
        return result.affectedRows > 0;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Event;
