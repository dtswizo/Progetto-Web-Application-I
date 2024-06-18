import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

const LoginPage = ({ login, message, setMessage }) => {
  useEffect(() => {
    setMessage(message);
  }, [message, setMessage]);

  return (
    <Container fluid className="login-page">
      <Row className="justify-content-center align-items-center vh-100">
        <Col md={6} lg={4}>
          <LoginForm login={login} message={message} setMessage={setMessage} />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
