
const SERVER_URL = 'http://localhost:3001';



const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  
  }
};


const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

async function fetchRoundContent(game_id) {
  const response = await fetch(`${SERVER_URL}/api/roundcontent?game_id=${game_id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Errore API fetchRoundContent');
  }
  const data = await response.json();
  return data;
}

async function create_game(user_id) {
    const response = await fetch(SERVER_URL + '/api/create_game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify({ user_id }), // Passare user_id nel body
    });

    if (!response.ok) {
      throw new Error('Errore API create_game');
    }
    const data = await response.json();
    return data;
};

async function add_round(game_id,user_id,meme_img,answer,is_correct) {
    const response = await fetch(SERVER_URL + '/api/add_round', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify({ game_id,user_id,meme_img,answer,is_correct }),
    });

    if (!response.ok) {
      throw new Error('Errore API add_round');
    }

    const data = await response.json();
    return data;
 
};

async function fetchHistory(user_id) {
    const response = await fetch(`${SERVER_URL}/api/history?user_id=${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Errore API fetchHistory');
    }

    const data = await response.json();
    return data;
}

async function updateScore(score, game_id) {
  const response = await fetch(SERVER_URL + '/api/update_score', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    body: JSON.stringify({ score, game_id }),
  });

  if (!response.ok) {
    throw new Error('Errore API updateScore');
  }

  const data = await response.json();
  return data;
}




const API = { logIn, logOut, getUserInfo, fetchRoundContent,create_game, add_round, fetchHistory, updateScore };
export default API;