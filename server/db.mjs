import sqlite from 'sqlite3';

// open the database
export const db = new sqlite.Database('memedb.db', (err) => {
  if (err) throw err;
});

db.serialize(() => {
  /*
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
*/
  db.run(`
    CREATE TABLE IF NOT EXISTS Memes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Captions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS MemeCaptions (
      meme_id INTEGER,
      caption_id INTEGER,
      PRIMARY KEY (meme_id, caption_id),
      FOREIGN KEY (meme_id) REFERENCES Memes(id),
      FOREIGN KEY (caption_id) REFERENCES Captions(id)
    )
  `);
});