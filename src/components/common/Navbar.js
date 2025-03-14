import React from "react";
import { Navbar as BootstrapNavbar, Container, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";
import axiosInstance from "../../api/axiosDefaults";
import { useClickOutsideToggle } from "../../hooks/useClickOutsideToggle";
import styles from "../../styles/NavBar.module.css";

// Navbar component
const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      console.log("Logging out...");
      
      // Clear token and user data from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Set current user to null
      setCurrentUser(null);
      
      // Send logout request to server (optional)
      await axiosInstance.post("/auth/logout/");
      console.log("Logout successful");
      
      // Refresh the page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if server logout fails, clear user session on frontend
      setCurrentUser(null);
      window.location.href = "/";
    }
  };

  // Logged in links
  const loggedInLinks = (
    <>
      <NavLink
      // Add the isActive prop to the NavLink component
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/events"
      >
        Events
      </NavLink>
      <NavLink
      
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/events/create"
      >
        Create Event
      </NavLink>
      {/* Favorites removed - users can access through profile */}
      <NavLink
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/people"
      >
        People
      </NavLink>
      <NavLink
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to={`/profile/${currentUser?.username}`}
      >
        Profile
      </NavLink>
      <Button 
        className="ms-2 btn-sm"
        variant="outline-secondary" 
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </>
  );
  
  const loggedOutLinks = (
    <>
      <NavLink
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/events"
      >
        Events
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/signin"
      >
        Sign In
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/signup"
      >
        Sign Up
      </NavLink>
    </>
  );

  return (
    <BootstrapNavbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/" className={styles.Logo}>
          <BootstrapNavbar.Brand className="text-success fw-bold">eventify</BootstrapNavbar.Brand>
        </NavLink>
        <BootstrapNavbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {currentUser ? loggedInLinks : loggedOutLinks}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};
export default NavBar;