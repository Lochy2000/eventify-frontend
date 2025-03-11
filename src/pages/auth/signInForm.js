import React, { useState, useEffect } from "react";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import styles from "../../styles/AuthForms.module.css";
import axiosInstance from "../../api/axiosDefaults";

const SignInForm = () => {
  // Redirect the user if they are already logged in
  useRedirect("loggedIn");
  const setCurrentUser = useSetCurrentUser();
  // State to store sign in data
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  // State to store loading state
  const [loading, setLoading] = useState(false);
  // State to store validation errors
  const [errors, setErrors] = useState({});
  // State to store success message
  const [successMessage, setSuccessMessage] = useState("");
  // Use the navigate hook to redirect to the previous page
  const navigate = useNavigate();
  // Use location to get any state passed from other components
  const location = useLocation();

  // Check for success message from registration
  useEffect(() => {
    // If we have a message from a redirect (e.g., after successful registration)
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the location state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      console.log("Sending login request with:", signInData);
      
      // Send login request directly
      const loginResponse = await axiosInstance.post("/auth/login/", signInData);
      console.log("Login successful:", loginResponse.data);
      
      // Store token in localStorage
      const token = loginResponse.data.key;
      localStorage.setItem('authToken', token);
      
      // Fetch current user data with token
      try {
        const userResponse = await axiosInstance.get("/auth/user/");
        console.log("User data received:", userResponse.data);
        
        // Store user in localStorage and context
        localStorage.setItem('user', JSON.stringify(userResponse.data));
        setCurrentUser(userResponse.data);
        navigate("/");
      } catch (userError) {
        console.error("Error fetching user data:", userError);
        setErrors({
          non_field_errors: ["Login successful but could not fetch user data. Please try again."]
        });
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setErrors(
        err.response?.data || {
          non_field_errors: ["An unexpected error occurred. Please try again."]
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
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
          
          {successMessage && (
            <Alert variant="success" className="mt-3">
              {successMessage}
            </Alert>
          )}

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
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
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