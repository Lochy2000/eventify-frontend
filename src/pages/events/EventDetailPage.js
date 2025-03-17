import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosDefaults';
import EventDetail from '../../components/events/EventDetail';
import Asset from '../../components/common/Asset';
import styles from '../../styles/EventDetailPage.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../../components/common/Avatar';
import { CommentList } from '../../components/comments';

/**
 * Page component for displaying a single event with its details and attendees
 */
const EventDetailPage = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const [event, setEvent] = useState({ results: [] });
  const [attendees, setAttendees] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Get event details
        const { data: eventData } = await axiosInstance.get(`/events/${id}/`);
        setEvent({ results: [eventData] });
        
        // Set page title
        document.title = `${eventData.title} | Eventify`;

        // Only fetch attendees if user is the event owner or is attending
        if (eventData.is_owner || eventData.attendance_id) {
          try {
            const { data: attendeesData } = await axiosInstance.get(`/events/${id}/attendees/`);
            setAttendees(attendeesData);
          } catch (attendeesErr) {
            // Using console.error is appropriate for actual errors
            console.error('Error fetching attendees:', attendeesErr);
          }
        }

        setHasLoaded(true);
      } catch (err) {
        // Using console.error is appropriate for actual errors
        console.error('Error fetching event details:', err);
        setError("Event not found or you don't have permission to view it.");
        setHasLoaded(true);
      }
    };

    fetchEventData();
  }, [id, currentUser]);

  return (
    <Container className={styles.EventDetailPage}>
      {hasLoaded ? (
        error ? (
          <Asset message={error} />
        ) : (
          <Row>
            <Col md={8}>
              {/* Event details */}
              <EventDetail
                event={event.results[0]}
                setEvent={setEvent}
              />
              
              {/* Comments section */}
              <div className="mt-4">
                <CommentList 
                  eventId={id} 
                  event={event} 
                  setEvent={setEvent} 
                />
              </div>
            </Col>
            
            <Col md={4}>
              {/* Attendees list - only shown to event owner or attendees */}
              {(event.results[0]?.is_owner || event.results[0]?.attendance_id) && (
                <Card className={styles.AttendeesCard}>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="m-0">Attendees ({event.results[0]?.attendees_count || 0})</h5>
                    {event.results[0]?.attendees_count > 0 && (
                      <a href={`/events/${id}/attendees`} className="btn btn-sm btn-outline-primary">View All</a>
                    )}
                  </Card.Header>
                  <Card.Body className={styles.AttendeesBody}>
                    {attendees.results?.length ? (
                      attendees.results.slice(0, 5).map((attendee) => (
                        <div key={attendee.id} className={styles.Attendee}>
                          <Avatar src={attendee.profile_image} height={40} text={attendee.owner} />
                          <div className={styles.AttendeeInfo}>
                            <p className={styles.AttendeeName}>{attendee.owner}</p>
                            <p className={styles.AttendeeDate}>
                              Registered: {new Date(attendee.registered_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No attendees yet.</p>
                    )}
                    
                    {attendees.results?.length > 5 && (
                      <div className="text-center mt-3">
                        <a href={`/events/${id}/attendees`} className="btn btn-sm btn-outline-primary">
                          View All {attendees.results.length} Attendees
                        </a>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}
              
              {/* Related events could go here */}
            </Col>
          </Row>
        )
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default EventDetailPage;
