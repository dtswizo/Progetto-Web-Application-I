import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

const LoginPage = ({ login }) => {
  return (
    <Container fluid className="login-page">
      <Row className="justify-content-center align-items-center vh-100">
        <Col md={6} lg={4}>
          <LoginForm login={login} />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
