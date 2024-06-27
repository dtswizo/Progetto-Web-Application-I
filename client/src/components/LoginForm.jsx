import React, { useState } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';
import "./LoginForm.css";

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const credentials = { username, password };

    try {
      await props.login(credentials);
    } catch (err) {
      props.setMessage({ msg: "Username o password errati", type: 'danger' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Accedi</h3>
      {props.message && (
        <Alert variant={props.message.type} dismissible onClose={() => props.setMessage('')}>
          <Alert.Heading>{props.message.type === 'danger' ? 'Error' : 'Success'}</Alert.Heading>
          <p>{props.message.msg}</p>
        </Alert>
      )}
      <div className="mb-3">
        <label htmlFor="email">Indirizzo email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Inserisci email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Inserisci password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="d-grid">
        <Button type="submit" className="custom-button">
          Continua
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
