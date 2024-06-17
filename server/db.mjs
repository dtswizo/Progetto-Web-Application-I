import sqlite from 'sqlite3';

// open the database
export const db = new sqlite.Database('memedb.db', (err) => {
  if (err) throw err;
});