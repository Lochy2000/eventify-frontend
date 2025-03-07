import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import axios from "axios";
import { removeTokenTimestamp } from "../utils/utils";
import { useClickOutsideToggle } from "../hooks/useClickOutsideToggle";
import styles from "../styles/NavBar.module.css";

//  authentication state 
const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const {expanded, setExpanded, ref} = useClickOutsideToggle();
  const handleSingOut = async () => {
    try {
      await axios.post("api/auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (error) {
      console.error(error);
    }
  };

  const loggedInLinks = (
    <>
      <Nav.Link 
        className={({ isActive }) =>
          `${styles.NavLink} ${isActive? styles.active : ""}`
      }
      on = "/events"
      >
        Events
      </Nav.Link>
    <NavLink
        className={({ isActive }) => 
          `${styles.NavLink} ${isActive ? styles.Active : ""}`
        }
        to="/events/create"
      >
        Create Event
      </NavLink>

    </>
  );
  const loggedOutLinks = (
    <>
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
    <NavBar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
      >
        <Container>
          <NavLink to="/" className={styles.Logo}>
            <Navbar.Brand className="text-success fw-bold">eventify</Navbar.Brand>
          </NavLink>
          <Navbar.Toggle
            ref={ref}
            onClick={() => setExpanded(!expanded)}
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {currentUser ? loggedInLinks : loggedOutLinks}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </NavBar>
  );
}
export default NavBar;