import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosDefaults';
import Avatar from '../../components/common/Avatar';
import Asset from '../../components/common/Asset';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import styles from '../../styles/EventAttendeesPage.module.css';

/**
 * Page component for displaying all attendees of an event
 */
const EventAttendeesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchEventAttendees = async () => {
      try {
        // Get event details and attendees
        const { data: eventData } = await axiosInstance.get(`/events/${id}/`);
        setEvent(eventData);
        
        // Only continue to fetch attendees if user is the owner or an attendee
        if (eventData.is_owner || eventData.attendance_id) {
          try {
            const { data: attendeesData } = await axiosInstance.get(`/events/${id}/attendees/`);
            setAttendees(attendeesData);
          } catch (attendeesErr) {
            console.error('Error fetching attendees:', attendeesErr);
            setError('Unable to load attendees. Please try again later.');
          }
        } else {
          setError('You don\'t have permission to view the attendees list.');
        }
        
        // Set page title with event name
        document.title = `${eventData.title} Attendees | Eventify`;
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Event not found or you don\'t have permission to view it.');
      } finally {
        setHasLoaded(true);
      }
    };

    fetchEventAttendees();
  }, [id, navigate]);

  return (
    <Container className={styles.EventAttendeesPage}>
      {hasLoaded ? (
        error ? (
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Error</Card.Title>
              <Card.Text>{error}</Card.Text>
              <Button variant="primary" onClick={() => navigate(`/events/${id}`)}>
                Back to Event
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
            <Row className="mb-4">
              <Col>
                <h1 className="h2">{event.title} - Attendees</h1>
                <p>
                  <Link to={`/events/${id}`}>Back to event</Link>
                </p>
              </Col>
            </Row>
            
            <Row>
              <Col md={8}>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="m-0">Attendees ({attendees.count || 0})</h5>
                  </Card.Header>
                  
                  {attendees.results?.length > 0 ? (
                    <ListGroup variant="flush">
                      {attendees.results.map((attendee) => (
                        <ListGroup.Item key={attendee.id} className={styles.AttendeeItem}>
                          <Link to={`/profile/${attendee.owner}`} className={styles.AttendeeLink}>
                            <Avatar src={attendee.profile_image} height={50} text={attendee.owner} />
                            <div className="ml-3">
                              <h6>{attendee.owner}</h6>
                              <p className="text-muted mb-0">
                                Registered: {new Date(attendee.registered_at).toLocaleDateString()}
                              </p>
                            </div>
                          </Link>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <Card.Body>
                      <p className="text-center">No attendees yet.</p>
                    </Card.Body>
                  )}
                </Card>
              </Col>
              
              <Col md={4}>
                <Card>
                  <Card.Header>
                    <h5>Event Details</h5>
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Text>
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text>
                      <strong>Time:</strong> {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Card.Text>
                    <Card.Text>
                      <strong>Location:</strong> {event.location}
                    </Card.Text>
                    <Card.Text>
                      <strong>Category:</strong> {event.category}
                    </Card.Text>
                    
                    <Link to={`/events/${id}`} className="btn btn-primary w-100">
                      View Full Event
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default EventAttendeesPage;
