const db = require('./config/db');

async function approve() {
    try {
        console.log("Approving 'Sister Rejoice' testimony in the database...");
        const [result] = await db.query("UPDATE testimonies SET status = 'approved' WHERE id = 1");
        console.log("Success! Rows updated:", result.affectedRows);
    } catch (err) {
        console.error("Failed to approve testimony:", err.message);
    } finally {
        process.exit(0);
    }
}

approve();
