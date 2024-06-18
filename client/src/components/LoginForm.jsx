import React, { useState } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';

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
      <h3>Sign In</h3>
      {props.message && (
        <Alert variant={props.message.type} dismissible onClose={() => props.setMessage('')}>
          <Alert.Heading>{props.message.type === 'danger' ? 'Error' : 'Success'}</Alert.Heading>
          <p>{props.message.msg}</p>
        </Alert>
      )}
      <div className="mb-3">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter email"
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
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
