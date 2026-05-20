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

module.exports = Auth;
