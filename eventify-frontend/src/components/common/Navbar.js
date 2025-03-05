// src/components/common/Navbar.js:
import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navigation = () => {
    // replaced with actual authentication state later
const isAuthenticated = false;
  
return (
  <Navbar bg="light" expand="lg">
    <Container>
      <Navbar.Brand as={Link} to="/" className="text-success fw-bold">
        eventify
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {isAuthenticated ? (
            <>
              <Nav.Link as={Link} to="/profile/username">Profile</Nav.Link>
              <Nav.Link as={Link} to="/events/create">Create Event</Nav.Link>
              <Button variant="outline-secondary">Sign Out</Button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
              <Button 
                as={Link} 
                to="/signup" 
                variant="success"
              >
                Sign Up
              </Button>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
};

export default Navigation;