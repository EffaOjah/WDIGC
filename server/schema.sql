CREATE DATABASE IF NOT EXISTS wdigc_db;
USE wdigc_db;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sermons Table
CREATE TABLE IF NOT EXISTS sermons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    video_id VARCHAR(50),
    thumbnail_path VARCHAR(255),
    link VARCHAR(255),
    speaker VARCHAR(100) DEFAULT 'Apostle Omotosho Tope Joseph',
    sermon_date VARCHAR(100),
    scripture VARCHAR(100),
    category VARCHAR(50),
    audio_path VARCHAR(255),
    excerpt TEXT,
    transcript TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    date_text VARCHAR(100),
    time_text VARCHAR(100),
    location VARCHAR(255),
    short_desc TEXT,
    long_desc TEXT,
    blessing TEXT,
    image_path VARCHAR(255),
    event_date VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ministries Table
CREATE TABLE IF NOT EXISTS ministries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonies Table
CREATE TABLE IF NOT EXISTS testimonies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    category VARCHAR(50),
    category_text VARCHAR(100),
    scripture VARCHAR(100),
    text TEXT NOT NULL,
    initials VARCHAR(10),
    date_text VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Growth Forms Registration Table
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
);

