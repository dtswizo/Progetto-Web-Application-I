import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite3.Database('memedb.db'); // Modifica con il percorso al tuo database

// Funzione per generare un salt
const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Funzione per hashare la password
const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
};

// Funzione per inserire un nuovo utente nel database
const insertUser = async (id,email, name, password) => {
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  
  const sql = 'INSERT INTO user (id,email, name, hash, salt) VALUES (?,?, ?, ?, ?)';
  db.run(sql, [id,email, name, hash, salt], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Un nuovo utente è stato inserito con l'id ${this.lastID}`);
  });
};

// Inserisci qui i dati dell'utente che vuoi aggiungere
const email = 'prova@polito.it';
const name = 'prova';
const password = 'prova';
const id = 5;

insertUser(id,email, name, password);
