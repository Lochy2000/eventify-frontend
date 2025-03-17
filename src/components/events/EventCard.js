import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Avatar from '../common/Avatar';
import styles from '../../styles/EventCard.module.css';

/**
 * Card component for displaying an event summary
 * 
 * @param {Object} props Component props
 * @param {Object} props.event - Event data to display
 */
const EventCard = ({ event }) => {
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
  } = event;

  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const isOwner = currentUser?.username === owner;
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Function to handle event deletion
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/events/${id}/`);
      // Redirect to events page or refresh the current page
      navigate('/events');
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  // Format the event date for display
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString();
  const timeFromNow = new Date(date) > new Date() 
    ? 'Upcoming' 
    : 'Past event';

  return (
    <Card className={styles.Event}>
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between">
          <Link to={`/profile/${owner}`} className="d-flex align-items-center">
            <Avatar src={event.profile_image || event.avatar_url} height={40} text={owner} />
            <span>{owner}</span>
          </Link>
          <div className="d-flex align-items-center">
            <span className="me-2">{formattedDate}</span>
            {isOwner && (
              <>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Edit event</Tooltip>}
                >
                  <button
                    className={styles.EditButton}
                    onClick={() => navigate(`/events/${id}/edit`)}
                    aria-label="Edit event"
                  >
                    <i className="fas fa-edit" />
                  </button>
                </OverlayTrigger>
                
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Delete event</Tooltip>}
                >
                  <button
                    className={styles.DeleteButton}
                    onClick={() => setShowDeleteModal(true)}
                    aria-label="Delete event"
                  >
                    <i className="fas fa-trash" />
                  </button>
                </OverlayTrigger>
              </>
            )}
          </div>
        </div>
      </Card.Body>
      
      {/* Delete confirmation modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Event
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Link to={`/events/${id}`}>
        <Card.Img 
          src={cover || 'https://res.cloudinary.com/dpw2txejq/image/upload/default_post_o0lbny'} 
          alt={title} 
          height="200"
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            console.log(`Error loading event cover: ${cover}`);
            e.target.src = 'https://res.cloudinary.com/dpw2txejq/image/upload/default_post_o0lbny';
          }}
        />
      </Link>
      
      <Card.Body>
        <Link to={`/events/${id}`}>
          <Card.Title className={styles.Title}>{title}</Card.Title>
        </Link>
        <Card.Text className={styles.Location}>
          <i className="fas fa-map-marker-alt" /> {location}
        </Card.Text>
        <Card.Text className={styles.Category}>
          <span className={styles.CategoryBadge}>{category}</span>
          {price > 0 ? (
            <span className={styles.Price}>${price}</span>
          ) : (
            <span className={styles.FreeEvent}>Free</span>
          )}
        </Card.Text>
        <Card.Text className={styles.Description}>
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </Card.Text>
        
        {/* Event stats section */}
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
          <span>
            <i className="far fa-clock" /> {timeFromNow}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

EventCard.propTypes = {
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
    profile_image: PropTypes.string,
    avatar_url: PropTypes.string,
  }).isRequired,
};

export default EventCard;
