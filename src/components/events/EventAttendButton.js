import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axiosInstance from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

/**
 * Button component for registering/unregistering for an event
 * 
 * @param {Object} props Component props
 * @param {number} props.eventId - ID of the event
 * @param {number|null} props.attendanceId - ID of attendance record (null if not attending)
 * @param {function} props.setEvent - Function to update event state
 */
const EventAttendButton = ({ eventId, attendanceId, setEvent }) => {
  const currentUser = useCurrentUser();
  const [isRegistering, setIsRegistering] = useState(false);

  // If user isn't logged in, don't render the button
  if (!currentUser) return null;

  const handleAttendance = async () => {
    try {
      setIsRegistering(true);

      if (attendanceId) {
        // User is already registered, so cancel registration
        await axiosInstance.delete(`/attendees/${attendanceId}/`);
        
        // Update event state to reflect unregistration
        setEvent(prevEvent => ({
          ...prevEvent,
          attendees_count: prevEvent.attendees_count - 1,
          attendance_id: null
        }));
      } else {
        // User is not registered, so register
        const { data } = await axiosInstance.post('/attendees/', { event: eventId });
        
        // Update event state to reflect registration
        setEvent(prevEvent => ({
          ...prevEvent,
          attendees_count: prevEvent.attendees_count + 1,
          attendance_id: data.id
        }));
      }
      
      // Refresh the page to ensure UI is updated
      window.location.reload();
      
    } catch (err) {
      // Log error but don't crash the app
      console.error('Error toggling event attendance:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Button
      variant={attendanceId ? 'danger' : 'success'}
      onClick={handleAttendance}
      disabled={isRegistering}
    >
      {isRegistering ? 'Processing...' : attendanceId ? 'Cancel Registration' : 'Register for Event'}
    </Button>
  );
};

export default EventAttendButton;
