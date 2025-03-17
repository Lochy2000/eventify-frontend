import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import axiosInstance from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

/**
 * Button component for favoriting/unfavoriting an event
 * 
 * @param {Object} props Component props
 * @param {number} props.eventId - ID of the event
 * @param {number|null} props.favoriteId - ID of favorite record (null if not favorited)
 * @param {function} props.setEvent - Function to update event state
 * @param {function} props.setEvents - Function to update events list state (optional)
 */
const FavoriteButton = ({ eventId, favoriteId, setEvent, setEvents }) => {
  const currentUser = useCurrentUser();
  const [isToggling, setIsToggling] = useState(false);

  // If user isn't logged in, don't render the button
  if (!currentUser) return null;

  const handleFavorite = async () => {
    try {
      setIsToggling(true);

      if (favoriteId) {
        // User has already favorited, so unfavorite
        await axiosInstance.delete(`/favorites/${favoriteId}/`);
        
        // Update event state to reflect unfavorite
        setEvent(prevEvent => ({
          ...prevEvent,
          favorites_count: prevEvent.favorites_count - 1,
          favorite_id: null
        }));
        
        // Update events list if provided
        if (setEvents) {
          setEvents(prevEvents => ({
            ...prevEvents,
            results: prevEvents.results.map(event => {
              return event.id === eventId
                ? {
                    ...event,
                    favorites_count: event.favorites_count - 1,
                    favorite_id: null,
                  }
                : event;
            }),
          }));
        }
      } else {
        // User has not favorited, so add favorite
        const { data } = await axiosInstance.post('/favorites/', { event: eventId });
        
        // Update event state to reflect favorite
        setEvent(prevEvent => ({
          ...prevEvent,
          favorites_count: prevEvent.favorites_count + 1,
          favorite_id: data.id
        }));
        
        // Update events list if provided
        if (setEvents) {
          setEvents(prevEvents => ({
            ...prevEvents,
            results: prevEvents.results.map(event => {
              return event.id === eventId
                ? {
                    ...event,
                    favorites_count: event.favorites_count + 1,
                    favorite_id: data.id,
                  }
                : event;
            }),
          }));
        }
      }
      
      // Refresh the page to ensure UI is updated
      window.location.reload();
      
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Button
      variant={favoriteId ? "danger" : "outline-danger"}
      className="ml-2"
      onClick={handleFavorite}
      disabled={isToggling}
      aria-label={favoriteId ? "Remove from favorites" : "Add to favorites"}
    >
      <i className={favoriteId ? "fas fa-heart" : "far fa-heart"} />
      {favoriteId ? " Unfavorite" : " Favorite"}
    </Button>
  );
};

FavoriteButton.propTypes = {
  eventId: PropTypes.number.isRequired,
  favoriteId: PropTypes.number,
  setEvent: PropTypes.func.isRequired,
  setEvents: PropTypes.func,
};

export default FavoriteButton;
