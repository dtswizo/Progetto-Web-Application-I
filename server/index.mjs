import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { getUser } from './user-dao.mjs';
import {getMemeAndCaption,create_game,add_round, fetch_user_data, update_score} from './meme-caption-dao.mjs';

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

// Mi permette di accedere alle foto con http://localhost:3001/resources/x.jpg
app.use('/resources', express.static("resources"));

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// Passport configuration
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
    const user = await getUser(username, password);
    if (!user) {
      return cb(null, false, { message: 'Incorrect username or password.' });
    }
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

app.use(session({
  secret: "cambiato",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());



//PASSPORT API
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


//MEME-CAPTION API
app.get('/api/roundcontent', async (req, res) => {
  const gameId = req.query.game_id;

  if (!gameId) {
    return res.status(400).json({ error: 'game_id is required' });
  }

  try {
    const data = await getMemeAndCaption(gameId);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/create_game', async (req, res) => {
  const { user_id } = req.body;
  try {
    const result = await create_game(user_id);
    res.status(201).json({ success: true, game_id: result});
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/add_round', async (req, res) => {
  const { game_id } = req.body;
  const { user_id } = req.body;
  const { meme_img } = req.body;
  const { answer } = req.body;
  const { is_correct} = req.body;

  
  try {
    const result = await add_round(game_id,user_id,meme_img,answer,is_correct);
    res.status(201).json({success: true});
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/history', async (req, res) => {
  const user_id = req.query.user_id; 
  try {
    const data = await fetch_user_data(user_id);
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.patch('/api/update_score', async (req, res) => {
  const { score, game_id } = req.body;
  try {
    const result = await update_score(score, game_id);
    res.status(200).json({success: true});
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`API server started at http://localhost:${port}`);
});
