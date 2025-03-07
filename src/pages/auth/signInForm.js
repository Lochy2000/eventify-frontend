import React, { useState } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link, useNavigate } from "react-router-dom";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimeStamp } from "../../utils/utils";
import styles from "../../styles/AuthForms.module.css";

const SignInForm = () => {
    useRedirect("loggedIn");
    const setCurrentUser = useSetCurrentUser();
    const [signInData, setSignInData] = useState({
    username: "",
    password: "",
    });
    const { username, password } = signInData;

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
        const { data } = await axios.post("/api/auth/login/", signInData);
        setCurrentUser(data.user);
        setTokenTimeStamp(data);
        navigate(-1);
        } catch (err) {
        setErrors(err.response?.data || {});
        }
    };

    const handleChange = (event) => {
        setSignInData({
          ...signInData,
          [event.target.name]: event.target.value,
        });
      };

      return (
        <Row className="justify-content-center">
          <Col className="my-auto p-0 p-md-2" md={6}>
            <Container className={styles.FormContent}>
              <h1 className={styles.Header}>Sign In</h1>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    className={styles.Input}
                    value={username}
                    onChange={handleChange}
                  />
                </Form.Group>
                {errors.username?.map((message, idx) => (
                  <Alert key={idx} variant="warning">
                    {message}
                  </Alert>
                ))}
    
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    className={styles.Input}
                    value={password}
                    onChange={handleChange}
                  />
                </Form.Group>
                {errors.password?.map((message, idx) => (
                  <Alert key={idx} variant="warning">
                    {message}
                  </Alert>
                ))}
    
                <Button
                  className="w-100 mt-3 bg-success"
                  type="submit"
                >
                  Sign in
                </Button>
                {errors.non_field_errors?.map((message, idx) => (
                  <Alert key={idx} variant="warning" className="mt-3">
                    {message}
                  </Alert>
                ))}
              </Form>
            </Container>
            <Container className="mt-3 p-3 bg-white rounded shadow text-center">
              <Link className={styles.Link} to="/signup">
                Don't have an account? <span>Sign up now!</span>
              </Link>
            </Container>
          </Col>
          <Col
            md={6}
            className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
          >
            <Image
              className="img-fluid"
              src="/images/signin.jpg"
              alt="Sign In"
            />
          </Col>
        </Row>
      );
    };
    
    export default SignInForm;