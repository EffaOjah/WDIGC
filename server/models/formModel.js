const db = require('../config/db');

// Self-healing runtime database migration to create forms table on boot
const migrate = async () => {
    try {
        // Create forms table if it does not exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS forms (
                id VARCHAR(50) PRIMARY KEY,
                category VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                contact VARCHAR(100) NOT NULL,
                type VARCHAR(255),
                date_track VARCHAR(255),
                details TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("[SQL Migration] 'forms' table self-healed/created successfully.");
    } catch (e) {
        console.error("[SQL Migration] Self-healing forms schema upgrade failed:", e.message);
    }
};

// Execute boot migrations
migrate();

const Form = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM forms ORDER BY created_at DESC');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM forms WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        await db.query(
            `INSERT INTO forms 
             (id, category, name, email, contact, type, date_track, details, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.id,
                data.category,
                data.name,
                data.email || '',
                data.contact,
                data.type || '',
                data.date_track || '',
                data.details || '',
                data.status || 'pending'
            ]
        );
        return data.id;
    },
    toggleStatus: async (id) => {
        const [rows] = await db.query('SELECT status FROM forms WHERE id = ?', [id]);
        if (rows.length === 0) return false;
        
        const newStatus = rows[0].status === 'processed' ? 'pending' : 'processed';
        const [result] = await db.query('UPDATE forms SET status = ? WHERE id = ?', [newStatus, id]);
        return result.affectedRows > 0;
    },
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM forms WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Form;
