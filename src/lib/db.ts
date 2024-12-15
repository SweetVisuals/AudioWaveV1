import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'plugoplq_admin',
  password: 'Longlonglong1!',
  database: 'plugoplq_users'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Helper function to execute queries
export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Initialize database tables
export async function initializeTables() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email_address VARCHAR(255),
        password VARCHAR(255),
        walletaddress VARCHAR(255) NOT NULL UNIQUE,
        followers INT DEFAULT 0,
        profilepicture VARCHAR(255),
        banner VARCHAR(255),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notifications BOOLEAN DEFAULT true
      )
    `);

    // Create tracks table
    await query(`
      CREATE TABLE IF NOT EXISTS tracks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        audio_url VARCHAR(255) NOT NULL,
        price_buy DECIMAL(10,2),
        price_lease DECIMAL(10,2),
        gems INT DEFAULT 0,
        streams INT DEFAULT 0,
        upvotes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create interactions table
    await query(`
      CREATE TABLE IF NOT EXISTS interactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        track_id INT NOT NULL,
        type ENUM('gem', 'upvote', 'stream') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (track_id) REFERENCES tracks(id),
        UNIQUE KEY unique_interaction (user_id, track_id, type)
      )
    `);

    // Create comments table
    await query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        track_id INT NOT NULL,
        content TEXT NOT NULL,
        likes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (track_id) REFERENCES tracks(id)
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize tables:', error);
    throw error;
  }
}