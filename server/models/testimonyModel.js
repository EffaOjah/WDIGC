const db = require('../config/db');

// Self-healing runtime database migration to append any missing fields on boot
const migrate = async () => {
    try {
        // Create testimonies table if it does not exist at all
        await db.query(`
            CREATE TABLE IF NOT EXISTS testimonies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                text TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Query columns layout in MySQL for the testimonies table
        const [columns] = await db.query('SHOW COLUMNS FROM testimonies');
        const existingColumns = columns.map(c => c.Field.toLowerCase());
        
        // Define required columns list
        const requiredColumns = [
            { name: 'location', query: "ALTER TABLE testimonies ADD COLUMN location VARCHAR(255)" },
            { name: 'category', query: "ALTER TABLE testimonies ADD COLUMN category VARCHAR(50)" },
            { name: 'category_text', query: "ALTER TABLE testimonies ADD COLUMN category_text VARCHAR(100)" },
            { name: 'scripture', query: "ALTER TABLE testimonies ADD COLUMN scripture VARCHAR(100)" },
            { name: 'initials', query: "ALTER TABLE testimonies ADD COLUMN initials VARCHAR(10)" },
            { name: 'date_text', query: "ALTER TABLE testimonies ADD COLUMN date_text VARCHAR(100)" }
        ];
        
        // Check and apply missing table columns
        for (const col of requiredColumns) {
            if (!existingColumns.includes(col.name.toLowerCase())) {
                await db.query(col.query);
                console.log(`[SQL Migration] Added column: '${col.name}' to 'testimonies' table successfully.`);
            }
        }
    } catch (e) {
        console.error("[SQL Migration] Self-healing testimony schema upgrade failed:", e.message);
    }
};

// Execute boot migrations
migrate();

const Testimony = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM testimonies ORDER BY created_at DESC');
        return rows;
    },
    getApproved: async () => {
        const [rows] = await db.query("SELECT * FROM testimonies WHERE status = 'approved' ORDER BY created_at DESC");
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM testimonies WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const [result] = await db.query(
            `INSERT INTO testimonies 
             (name, location, category, category_text, scripture, text, initials, date_text, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.name, 
                data.location, 
                data.category, 
                data.category_text || '', 
                data.scripture || '', 
                data.text, 
                data.initials, 
                data.date_text || 'Just now',
                data.status || 'pending'
            ]
        );
        return result.insertId;
    },
    toggleStatus: async (id) => {
        const [rows] = await db.query('SELECT status FROM testimonies WHERE id = ?', [id]);
        if (rows.length === 0) return false;
        
        const newStatus = rows[0].status === 'approved' ? 'pending' : 'approved';
        const [result] = await db.query('UPDATE testimonies SET status = ? WHERE id = ?', [newStatus, id]);
        return result.affectedRows > 0;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM testimonies WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Testimony;
