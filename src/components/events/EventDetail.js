import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, OverlayTrigger, Tooltip, Badge, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import axiosInstance from '../../api/axiosDefaults';
import Avatar from '../common/Avatar';
import styles from '../../styles/EventDetail.module.css';
import EventAttendButton from './EventAttendButton';
import FavoriteButton from '../favorites/FavoriteButton';

/**
 * Component for displaying detailed event information
 * 
 * @param {Object} props Component props
 * @param {Object} props.event - Event data to display
 * @param {function} props.setEvent - Function to update event state
 * @param {function} props.setEvents - Function to update events list state (optional)
 */
const EventDetail = ({ event, setEvent, setEvents }) => {
  const {
    id,
    owner,
    title,
    cover,
    description,
    date,
    location,
    category,
    price,
    likes_count,
    comments_count,
    attendees_count,
    attendance_id,
    favorite_id,
    created_at,
    // updated_at value extracted but not used - kept for structure completeness
    // eslint-disable-next-line no-unused-vars
    updated_at,
    is_owner,
  } = event;

  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // Format the event date for display
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString();
  const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Handle event deletion with a simpler approach
  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    
    if (confirmDelete) {
      setIsDeleting(true);
      // Store deletion message in sessionStorage to show after page reload
      sessionStorage.setItem('deleteMessage', 'Event deleted successfully!');
      
      // Make the delete request and force page reload
      axiosInstance.delete(`/events/${id}/`)
        .then(() => {
          // Redirect to events page with full page reload
          window.location.href = '/events';
        })
        .catch((err) => {
          console.error('Error deleting event:', err);
          alert('Error deleting event. Please try again.');
          setIsDeleting(false);
        });
    }
  };

  // Log the image URL for debugging
  console.log('Event cover URL:', cover);

  return (
    <Card className={styles.EventDetail}>
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <Link to={`/profile/${owner}`} className="d-flex align-items-center">
            <Avatar src={event.profile_image} height={55} text={owner} />
            <span className={styles.Owner}>{owner}</span>
          </Link>
          <div className="d-flex align-items-center">
            <span className={styles.Date}>Created: {created_at}</span>
            {is_owner && (
              <>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Edit event</Tooltip>}
                >
                  <Button
                    variant="link"
                    className={styles.EditButton}
                    onClick={() => navigate(`/events/${id}/edit`)}
                    aria-label="Edit event"
                  >
                    <i className="fas fa-edit" />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Delete event</Tooltip>}
                >
                  <Button
                    variant="link"
                    className={styles.DeleteButton}
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label="Delete event"
                  >
                    <i className="fas fa-trash" />
                  </Button>
                </OverlayTrigger>
              </>
            )}
          </div>
        </div>
      </Card.Body>
      
      <Card.Img 
        src={cover || 'https://res.cloudinary.com/dpw2txejq/image/upload/v1/default_post_o0lbny'} 
        alt={title} 
        className={styles.EventImage}
        onError={(e) => {
          e.target.src = 'https://res.cloudinary.com/dpw2txejq/image/upload/v1/default_post_o0lbny';
        }}
      />
      
      <Card.Body>
        <Card.Title className={styles.Title}>{title}</Card.Title>
        
        <Row className="mb-3">
          <Col xs={12} md={6} className="mb-2 mb-md-0">
            <div className={styles.EventInfo}>
              <i className="fas fa-calendar-alt" />
              <span>
                {formattedDate} at {formattedTime}
              </span>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className={styles.EventInfo}>
              <i className="fas fa-map-marker-alt" />
              <span>{location}</span>
            </div>
          </Col>
        </Row>
        
        <Row className="mb-3">
          <Col xs={12} md={6} className="mb-2 mb-md-0">
            <div className={styles.EventInfo}>
              <i className="fas fa-tag" />
              <Badge variant="secondary" className={styles.CategoryBadge}>
                {category}
              </Badge>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className={styles.EventInfo}>
              <i className="fas fa-dollar-sign" />
              <span>
                {price > 0 ? `$${price}` : 'Free'}
              </span>
            </div>
          </Col>
        </Row>
        
        <Card.Text className={styles.Description}>{description}</Card.Text>
        
        <div className={styles.EventStats}>
          <span>
            <i className="far fa-heart" /> {likes_count || 0}
          </span>
          <span>
            <i className="far fa-comment" /> {comments_count || 0}
          </span>
          <span>
            <i className="fas fa-users" /> {attendees_count || 0}
          </span>
        </div>
        
        <div className={styles.Actions}>
          {/* Only show attend button to non-owners */}
          {currentUser && !is_owner && (
            <EventAttendButton
              eventId={id}
              attendanceId={attendance_id}
              setEvent={setEvent}
            />
          )}
          
          {/* Show favorite button to all logged-in users */}
          {currentUser && (
            <FavoriteButton
              eventId={id}
              favoriteId={favorite_id}
              setEvent={setEvent}
              setEvents={setEvents}
            />
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventDetail;

EventDetail.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    owner: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cover: PropTypes.string,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    likes_count: PropTypes.number,
    comments_count: PropTypes.number,
    attendees_count: PropTypes.number,
    attendance_id: PropTypes.number,
    favorite_id: PropTypes.number,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string,
    is_owner: PropTypes.bool.isRequired,
    profile_image: PropTypes.string,
  }).isRequired,
  setEvent: PropTypes.func.isRequired,
  setEvents: PropTypes.func.isRequired,
};
