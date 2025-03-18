import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import EventForm from '../../components/events/EventForm';
import styles from '../../styles/EventCreatePage.module.css';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

/**
 * Page component for creating a new event
 */
const EventCreatePage = () => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    console.log('EventCreatePage - Current user state:', currentUser);
    if (!currentUser) {
      console.log('EventCreatePage - User not logged in, redirecting to signin');
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  // Set page title
  useEffect(() => {
    document.title = 'Create Event | Eventify';
  }, []);

  return (
    <Container className={styles.EventCreatePage}>
      <EventForm />
    </Container>
  );
};

export default EventCreatePage;
