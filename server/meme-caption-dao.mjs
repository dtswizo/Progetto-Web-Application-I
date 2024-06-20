import { db } from './db.mjs'; 


export const getMemeAndCaption = async () => {
    try {
      const sqlQuery1 = 'SELECT * FROM Memes ORDER BY RANDOM() LIMIT 1'; 
      const sqlQuery2 = 'SELECT * FROM Captions C,MemeCaptions MC WHERE MC.caption_id=C.id AND MC.meme_id=? ORDER BY RANDOM() LIMIT 2'; //Selezioni esattamente 2 caption corrette
      const sqlQuery3 = 'SELECT * FROM Captions WHERE id NOT IN (SELECT caption_id FROM MemeCaptions MC WHERE MC.meme_id=?) ORDER BY RANDOM() LIMIT 5';
  
      // Esegui la prima query
      const meme = await new Promise((resolve, reject) => {
        db.get(sqlQuery1, (err, meme) => {
          if (err) {
            reject(err);
          } else {
            resolve(meme);
          }
        });
      });

   
      // Esegui la seconda query usando il risultato della prima
      const captions = await new Promise((resolve, reject) => {
        db.all(sqlQuery2, [meme.id], (err, captions) => {
          if (err) {
            reject(err);
          } else {    
            resolve(captions);
          }
        });
      });
  
      // Esegui la terza query usando il risultato della prima
      const lastCaptions = await new Promise((resolve, reject) => {
        db.all(sqlQuery3, [meme.id], (err, lastCaptions) => {
          if (err) {
            reject(err);
          } else {
            resolve(lastCaptions);
          }
        });
      });
  
      // Restituisci i risultati
      return { meme, rightCaptions: captions, rngCaptions: lastCaptions };
  
    } catch (err) {
      throw err;
    }
  };

  export const create_game = async (user_id) => {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO game_matches (user_id) VALUES (?)`, [user_id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  };

  export const add_round = async (game_id,user_id,meme_img,answer,is_correct) => {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO Round_Data (game_id,user_id,meme_img,answer,is_correct) VALUES (?, ?, ?, ?, ?)`, [game_id,user_id,meme_img,answer,is_correct], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };