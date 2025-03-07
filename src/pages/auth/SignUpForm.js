import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import axios from "axios";
import { useRedirect } from "../../hooks/useRedirect";
import styles from "../../styles/AuthForms.module.css";

const SignUpForm = () => {
    useRedirect("loggedIn");
    const [signUpData, setSignUpData] = useState({
        username: "",
        password1: "",
        password2: "",
    });
    const {username, password1, password2} = signUpData;

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        setSignUpData({
            ...signUpData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("api/auth/registration/", signUpData);
            navigate("/signin");
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data);
            } else {
                console.error(error);
            }
        }
    };

    return (
        <Row className="justify-content-center">
        <Col className="my-auto p-0 p-md-2" md={6}>
            <Container className="p-4 bg-white rounded shadow">
            <h1 className="text-center">Sign Up</h1>

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Choose a username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                />
                </Form.Group>
                {errors.username?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
                ))}

                <Form.Group controlId="password1">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Create a password"
                    name="password1"
                    value={password1}
                    onChange={handleChange}
                />
                </Form.Group>
                {errors.password1?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                    {message}
                </Alert>
                ))}

                <Form.Group controlId="password2">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    name="password2"
                    value={password2}
                    onChange={handleChange}
                />
                </Form.Group>
                {errors.password2?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                    {message}
                </Alert>
                ))}

                <Button
                className="w-100 mt-3 bg-success"
                type="submit"
                >
                Sign up
                </Button>
                {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                    {message}
                </Alert>
                ))}
            </Form>
            </Container>

            <Container className="mt-3 p-3 bg-white rounded shadow text-center">
            <Link className="text-success" to="/signin">
                Already have an account? <span>Sign in</span>
            </Link>
            </Container>
        </Col>
        <Col
            md={6}
            className="my-auto d-none d-md-block p-2"
        >
            <Image
            className="img-fluid"
            src="/images/signup.jpg"
            alt="Sign Up"
            />
        </Col>
        </Row>
    );
};

export default SignUpForm;