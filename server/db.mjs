import sqlite from 'sqlite3';

// apertura db
export const db = new sqlite.Database('memedb.db', (err) => {
  if (err) throw err;
});

db.serialize(() => {
  
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      hash TEXT NOT NULL,
      salt TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS Game_Matches (
      game_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_score INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES user (id) 
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Round_Data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER,
      user_id INTEGER,
      meme_img TEXT,
      answer TEXT,
      is_correct BOOLEAN,
      FOREIGN KEY(game_id) REFERENCES Game_Matches(game_id),
      FOREIGN KEY (user_id) REFERENCES user (id) 
    )
  `);

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