import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../../contexts/CurrentUserContext';
import styles from '../../styles/NavBar.module.css';
import { useClickOutsideToggle } from '../../hooks/useClickOutsideToggle';

/**
 * Navigation bar component for the application
 */
const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  // Custom hook for mobile navbar toggle
  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  // Handle user logout
  const handleSignOut = async () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setCurrentUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };
  
  // Navigation links for logged-in users
  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        to="/events"
      >
        Discover
      </NavLink>
      
      <NavLink
        className={styles.NavLink}
        to="/people"
      >
        People
      </NavLink>
      
      <NavLink
        className={styles.NavLink}
        to={`/profile/${currentUser?.username}`}
      >
        Profile
      </NavLink>
      
      <Button
        className={styles.NavLink}
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </>
  );
  
  // Navigation links for logged-out users
  const loggedOutIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        to="/events"
      >
        Discover
      </NavLink>
      
      <NavLink
        className={styles.NavLink}
        to="/signin"
      >
        Sign In
      </NavLink>
      
      <NavLink
        className={styles.NavLink}
        to="/signup"
      >
        Sign Up
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <Navbar.Brand className={styles.NavBrand} href="/">
          <img
            src="/assets/images/logo.jpg"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Eventify Logo"
          />
          Eventify
        </Navbar.Brand>
        
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-left">
            <NavLink
              className={styles.NavLink}
              to="/"
            >
              Home
            </NavLink>
            
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;