const bcrypt = require('bcryptjs');
const db = require('../config/db');

const Auth = {
    login: async (username, password) => {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }
};

const addUser = async (username, password) => {
    try {
        let hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        return user;
    } catch (error) {
        console.log(error);
    }
};

// Self-healing default administrator database seed on boot
const seedDefaultAdmin = async () => {
    try {
        // Create users table if it does not exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const [rows] = await db.query('SELECT COUNT(*) as count FROM users');
        if (rows[0].count === 0) {
            let hashedPassword = await bcrypt.hash('admin123', 10);
            await db.query('INSERT INTO users (username, password) VALUES (?, ?)', ['WDIGC_admin', hashedPassword]);
            console.log("[SQL Migration] Created default administrator: 'WDIGC_admin' successfully.");
        }
    } catch (e) {
        console.error("[SQL Migration] Default administrator database seed failed:", e.message);
    }
};

seedDefaultAdmin();

module.exports = { Auth, addUser };
