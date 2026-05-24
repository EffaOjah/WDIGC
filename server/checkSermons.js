const db = require('./config/db');

async function check() {
    try {
        const [rows] = await db.query("SELECT id, title, video_id, link FROM sermons");
        console.log("Sermons in Database:");
        console.log(rows);
    } catch (err) {
        console.error("Failed to check database sermons:", err.message);
    } finally {
        process.exit(0);
    }
}

check();
