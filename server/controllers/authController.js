const jwt = require('jsonwebtoken');
const Auth = require('../models/authModel');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Auth.login(username, password);

        if (user) {
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.status(200).json({ success: true, token, user: { username: user.username } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { login };
