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
      console.log('Current user:', currentUser?.username);
      console.log('Favorite ID:', favoriteId);

      if (favoriteId) {
        // User has already favorited, so unfavorite
        console.log(`Deleting favorite with ID: ${favoriteId}`);
        await axiosInstance.delete(`/favorites/${favoriteId}/`);
        
        // Update local state
        setEvent(prevEvent => ({
          ...prevEvent,
          favorites_count: prevEvent.favorites_count ? prevEvent.favorites_count - 1 : 0,
          favorite_id: null
        }));
      } else {
        // User has not favorited, so add favorite
        console.log(`Adding favorite for event ID: ${eventId}`);
        const { data } = await axiosInstance.post('/favorites/', { event: eventId });
        console.log('Favorite created:', data);
        
        // Update local state
        setEvent(prevEvent => ({
          ...prevEvent,
          favorites_count: (prevEvent.favorites_count || 0) + 1,
          favorite_id: data.id
        }));
      }
      
      // Reload the page to ensure UI is in sync with backend
      window.location.reload();
      
    } catch (err) {
      console.error('Error toggling favorite:', err);
      if (err.response?.data) {
        console.error('Error details:', err.response.data);
      }
      alert('There was an error processing your favorite request. Please try again.');
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
