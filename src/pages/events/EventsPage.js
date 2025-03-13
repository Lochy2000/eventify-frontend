import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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

  // Set page title
  useEffect(() => {
    document.title = 'Events | Eventify';
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
    if (pathname === '/favorites') {
      return 'favorite=true&'; 
    } else if (pathname === '/attending') {
      return 'attending=true&';
    } else if (pathname === '/myevents') {
      return `owner=${currentUser?.username}&`;
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
