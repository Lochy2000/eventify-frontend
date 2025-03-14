import React, { useEffect, useState } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosDefaults';
import EventForm from '../../components/events/EventForm';
import Asset from '../../components/common/Asset';
import styles from '../../styles/EventEditPage.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

/**
 * Page component for editing an existing event
 */
const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  
  const [event, setEvent] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  // Set page title
  useEffect(() => {
    document.title = 'Edit Event | Eventify';
  }, []);

  // Fetch event data to edit
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosInstance.get(`/events/${id}/`);
        
        // Check if current user is the event owner
        if (data.is_owner) {
          setEvent(data);
        } else {
          // Redirect if not the owner
          navigate('/');
          // You could set an error state here to display a message
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setErrors(err.response?.data || {
          message: 'Event not found or could not be loaded.'
        });
      } finally {
        setHasLoaded(true);
      }
    };

    handleMount();
  }, [id, navigate]);

  return (
    <Container className={styles.EventEditPage}>
      {hasLoaded ? (
        <>
          {errors.message && (
            <Alert variant="warning">
              {errors.message}
            </Alert>
          )}
          
          {event ? (
            <EventForm event={event} />
          ) : !errors.message && (
            <Alert variant="warning">
              You don't have permission to edit this event.
            </Alert>
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default EventEditPage;
