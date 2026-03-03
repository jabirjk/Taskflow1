import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('taskflow.db');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('client', 'tasker', 'admin')) NOT NULL,
    avatar TEXT,
    bio TEXT,
    rating REAL DEFAULT 5.0,
    completed_tasks INTEGER DEFAULT 0,
    hourly_rate INTEGER,
    skills TEXT, -- JSON array
    balance REAL DEFAULT 0.0,
    is_corporate BOOLEAN DEFAULT 0,
    subscription_plan TEXT, -- 'basic', 'premium', 'enterprise'
    api_key TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    reviewer_id TEXT NOT NULL,
    reviewee_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES tasks(id),
    FOREIGN KEY(reviewer_id) REFERENCES users(id),
    FOREIGN KEY(reviewee_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT CHECK(type IN ('deposit', 'withdrawal', 'payment', 'earnings')) NOT NULL,
    status TEXT CHECK(status IN ('pending', 'completed', 'failed')) DEFAULT 'completed',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT CHECK(status IN ('open', 'assigned', 'completed', 'cancelled')) DEFAULT 'open',
    price_type TEXT CHECK(price_type IN ('hourly', 'fixed')) NOT NULL,
    price INTEGER NOT NULL,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_recurring BOOLEAN DEFAULT 0,
    recurrence_pattern TEXT, -- 'weekly', 'biweekly', 'monthly'
    insurance_status TEXT DEFAULT 'none', -- 'none', 'active', 'claimed'
    surge_multiplier REAL DEFAULT 1.0,
    FOREIGN KEY(client_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    tasker_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    scheduled_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES tasks(id),
    FOREIGN KEY(tasker_id) REFERENCES users(id),
    FOREIGN KEY(client_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );

  CREATE TABLE IF NOT EXISTS bids (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    tasker_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    message TEXT,
    status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES tasks(id),
    FOREIGN KEY(tasker_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK(type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed some initial data if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (id, name, email, role, avatar, bio, rating, completed_tasks, hourly_rate, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  
  insertUser.run('u1', 'Alex Rivera', 'alex@example.com', 'tasker', 'https://picsum.photos/seed/alex/200', 'Expert in home repairs and furniture assembly with 5+ years of experience.', 4.9, 124, 45, JSON.stringify(['Furniture Assembly', 'Mounting', 'General Repairs']));
  insertUser.run('u2', 'Sarah Chen', 'sarah@example.com', 'tasker', 'https://picsum.photos/seed/sarah/200', 'Professional cleaner and organizer. I love making spaces sparkle!', 5.0, 89, 35, JSON.stringify(['Cleaning', 'Organization', 'Laundry']));
  insertUser.run('u3', 'Marcus Jordan', 'marcus@example.com', 'tasker', 'https://picsum.photos/seed/marcus/200', 'Strong and reliable. Happy to help with moving, heavy lifting, and yard work.', 4.8, 210, 40, JSON.stringify(['Moving', 'Heavy Lifting', 'Yard Work']));
  insertUser.run('c1', 'Jane Doe', 'jane@example.com', 'client', 'https://picsum.photos/seed/jane/200', 'Looking for reliable help around the house.', 5.0, 0, null, null);
}

export default db;
