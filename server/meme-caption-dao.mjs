import { db } from './db.mjs';


export const getMemeAndCaption = async (game_id) => {
  
    const sqlQuery1 = `SELECT * FROM Memes WHERE filename NOT IN (SELECT meme_img FROM Round_Data WHERE game_id = ?) ORDER BY RANDOM() LIMIT 1`;
    const sqlQuery2 = 'SELECT * FROM Captions C, MemeCaptions MC WHERE MC.caption_id = C.id AND MC.meme_id = ? ORDER BY RANDOM() LIMIT 2';
    const sqlQuery3 = 'SELECT * FROM Captions WHERE id NOT IN (SELECT caption_id FROM MemeCaptions MC WHERE MC.meme_id = ?) ORDER BY RANDOM() LIMIT 5';

    const meme = await new Promise((resolve, reject) => {
      db.get(sqlQuery1, [game_id], (err, meme) => {
        if (err) {
          reject(err);
        } else {
          resolve(meme);
        }
      });
    });

    const captions = await new Promise((resolve, reject) => {
      db.all(sqlQuery2, [meme.id], (err, captions) => {
        if (err) {
          reject(err);
        } else {
          resolve(captions);
        }
      });
    });

    const lastCaptions = await new Promise((resolve, reject) => {
      db.all(sqlQuery3, [meme.id], (err, lastCaptions) => {
        if (err) {
          reject(err);
        } else {
          resolve(lastCaptions);
        }
      });
    });
    return { meme, rightCaptions: captions, rngCaptions: lastCaptions };
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

export const add_round = async (game_id, user_id, meme_img, answer, is_correct) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO Round_Data (game_id,user_id,meme_img,answer,is_correct) VALUES (?, ?, ?, ?, ?)`, [game_id, user_id, meme_img, answer, is_correct], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const fetch_user_data = async (user_id) => {
  const sql = `
    SELECT 
      gm.game_id,
      gm.total_score,
      rd.meme_img,
      rd.answer,
      rd.is_correct,
      (CASE WHEN rd.is_correct = 1 THEN 5 ELSE 0 END) as round_score
    FROM 
      Game_Matches gm
    JOIN 
      Round_Data rd ON gm.game_id = rd.game_id
    WHERE 
      gm.user_id = ? 
    ORDER BY 
      gm.game_id, rd.id
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, [user_id], (err, user_data) => {
      if (err) {
        reject(err);
      } else {
        resolve(user_data);
      }
    });
  });
};

