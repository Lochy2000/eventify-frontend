import React from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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
            <Avatar src={event.profile_image} height={40} text={owner} />
            <span>{owner}</span>
          </Link>
          <div className="d-flex align-items-center">
            <span>{formattedDate}</span>
            {isOwner && (
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
            )}
          </div>
        </div>
      </Card.Body>
      
      <Link to={`/events/${id}`}>
        <Card.Img 
          src={cover} 
          alt={title} 
          height="200"
          style={{ objectFit: 'cover' }}
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

export default EventCard;
