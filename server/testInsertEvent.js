const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/db');

async function test() {
    try {
        const testData = {
            tag: 'weekly',
            title: 'Midweek Communion Service Test',
            date_text: 'Every Wednesday',
            time_text: '5:30 PM',
            location: 'Calabar HQ',
            short_desc: 'Short desc test',
            long_desc: 'Long desc test',
            blessing: 'Proverbs 3:5',
            image_path: 'uploads/test.jpg',
            event_date: '2026-05-24'
        };

        console.log("Attempting to insert test event...");
        const [result] = await db.query(
            `INSERT INTO events 
             (tag, title, date_text, time_text, location, short_desc, long_desc, blessing, image_path, event_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                testData.tag, 
                testData.title, 
                testData.date_text, 
                testData.time_text, 
                testData.location, 
                testData.short_desc, 
                testData.long_desc, 
                testData.blessing, 
                testData.image_path, 
                testData.event_date
            ]
        );
        console.log("Insertion successful! Inserted ID:", result.insertId);
    } catch (err) {
        console.error("Insertion failed with MySQL Error:", err);
    } finally {
        process.exit(0);
    }
}

test();
