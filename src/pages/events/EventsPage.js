import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import EventList from '../../components/events/EventList';
import styles from '../../styles/EventsPage.module.css';
import { useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

/**
 * Main page component for displaying events
 */
const EventsPage = () => {
  const currentUser = useCurrentUser();
  const { pathname } = useLocation();
  const [successMessage, setSuccessMessage] = useState("");

  // Set page title and check for success message
  useEffect(() => {
    document.title = 'Events | Eventify';
    
    // Check for success message in sessionStorage
    const message = sessionStorage.getItem('deleteMessage');
    if (message) {
      setSuccessMessage(message);
      // Remove the message to prevent showing it again on refresh
      sessionStorage.removeItem('deleteMessage');
      
      // Auto-dismiss the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Determine which message to show based on URL
  const message = () => {
    if (pathname === '/favorites' && currentUser) {
      return 'No favorited events found. Browse events and click the heart icon to add them to your favorites!';
    } else if (pathname === '/attending' && currentUser) {
      return 'You are not attending any events yet. Browse events and register to attend!';
    } else if (pathname === '/myevents' && currentUser) {
      return 'You have not created any events yet. Use the "Create Event" button to get started!';
    } else {
      return 'No events found. Adjust your search or filters, or check back later!';
    }
  };

  // Determine filter string based on URL
  const getFilterString = () => {
    if (pathname === '/favorites' && currentUser) {
      return 'favorite=true&'; 
    } else if (pathname === '/attending' && currentUser) {
      return 'attending=true&';
    } else if (pathname === '/myevents' && currentUser) {
      return `owner__username=${currentUser?.username}&`;
    } else {
      return '';
    }
  };

  // Determine page title based on URL
  const getPageTitle = () => {
    if (pathname === '/favorites') {
      return 'Your Favorite Events';
    } else if (pathname === '/attending') {
      return 'Events You\'re Attending';
    } else if (pathname === '/myevents') {
      return 'Your Events';
    } else {
      return 'Discover Events';
    }
  };

  // Determine page subtitle based on URL
  const getPageSubtitle = () => {
    if (pathname === '/favorites') {
      return 'Events you\'ve saved for later.';
    } else if (pathname === '/attending') {
      return 'Events you\'ve registered to attend.';
    } else if (pathname === '/myevents') {
      return 'Events you\'ve created and are hosting.';
    } else {
      return 'Find something interesting happening near you.';
    }
  };

  return (
    <Container fluid className={styles.EventsPage}>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          {successMessage && (
            <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          )}
          <h1 className={styles.Header}>{getPageTitle()}</h1>
          <p className={styles.Subheader}>{getPageSubtitle()}</p>
          
          <EventList
            message={message()}
            filter={getFilterString()}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default EventsPage;
