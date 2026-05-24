const db = require('./config/db');

async function test() {
    try {
        console.log("Querying forms table info...");
        const [columns] = await db.query("SHOW COLUMNS FROM forms");
        console.log("\nForms Table Columns structure in MySQL:");
        columns.forEach(c => console.log(`- ${c.Field}: ${c.Type} (${c.Null === 'YES' ? 'nullable' : 'not null'})`));
    } catch (err) {
        console.error("Test failed:", err.message);
    } finally {
        process.exit(0);
    }
}

test();
