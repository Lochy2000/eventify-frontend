import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import axiosInstance from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import styles from "../../styles/AuthForms.module.css";

// Sign up form component
const SignUpForm = () => {
    useRedirect("loggedIn");
    const [signUpData, setSignUpData] = useState({
        username: "",
        password1: "",
        password2: "",
    });

    // Destructure the sign up data state
    const {username, password1, password2} = signUpData;

    // State to store loading state
    const [loading, setLoading] = useState(false);
    // State to store validation errors

    const [errors, setErrors] = useState({});
    // Use the navigate hook to redirect to the sign in page
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (event) => {
        // Update the sign up data state
        setSignUpData({
            // Spread the existing sign up data
            ...signUpData,
            // Update the changed field
            [event.target.name]: event.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            console.log("Sending registration request with:", {
                username: signUpData.username,
                password: "[FILTERED]"
            });

            // First, get a CSRF token
            await axiosInstance.get("/csrf/");
            
            // Send a POST request to the backend
            const signupResponse = await axiosInstance.post("/auth/registration/", signUpData);
            console.log("Registration successful", signupResponse);
            
            // If successful, redirect to sign in page
            navigate("/signin");
        } catch (error) {
            // Handle validation errors
            console.error("Registration error:", error.response?.data || error);
            if (error.response) {
                setErrors(error.response.data);
            } else {
                // Handle other errors
                setErrors({ non_field_errors: ["Connection error. Please try again."] });
            }
        } finally {
            setLoading(false);
        }
    };

    // Return the sign up form
    return (
        <Row className="justify-content-center">
            <Col className="my-auto p-0 p-md-2" md={6}>
                <Container className={styles.FormContent}>
                    <h1 className={styles.Header}>Sign Up</h1>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Choose a username"
                                name="username"
                                value={username}
                                className={styles.Input}
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
                                className={styles.Input}
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
                                className={styles.Input}
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
                            disabled={loading}
                            >
                            {loading ? "Signing up..." : "Sign up"}
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