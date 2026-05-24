const db = require('./config/db');

async function check() {
    try {
        const [rows] = await db.query("SELECT id, name, status FROM testimonies");
        console.log("Testimonies in Database:");
        console.log(rows);
    } catch (err) {
        console.error("Failed to check database testimonies:", err.message);
    } finally {
        process.exit(0);
    }
}

check();
