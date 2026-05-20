const bcrypt = require('bcryptjs');
const db = require('./db');

const seedAdmin = async () => {
    try {
        const username = 'admin';
        const password = 'password123'; // In a real app, change this immediately
        const hashedPassword = await bcrypt.hash(password, 10);

        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
            console.log('Admin user seeded successfully!');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        process.exit();
    }
};

seedAdmin();
