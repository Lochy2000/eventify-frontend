import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Nav } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Profile from '../components/profiles/Profile';
import EventCard from '../components/events/EventCard';
import axiosInstance from '../api/axiosDefaults';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import Alert from 'react-bootstrap/Alert';
import Asset from '../components/common/Asset';
import styles from '../styles/ProfilePage.module.css';

const ProfilePage = () => {
  const { username } = useParams();
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  
  // State for each tab content
  const [userEvents, setUserEvents] = useState({ results: [] });
  const [attendingEvents, setAttendingEvents] = useState({ results: [] });
  const [favoriteEvents, setFavoriteEvents] = useState({ results: [] });
  
  // Loading states for each tab
  const [eventsLoading, setEventsLoading] = useState(true);
  const [attendingLoading, setAttendingLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const isOwner = currentUser?.username === username;

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get profiles to find the one with matching username
        const { data } = await axiosInstance.get('/profiles/');
        const matchingProfile = data.results.find(profile => profile.owner === username);
        
        if (matchingProfile) {
          setProfile(matchingProfile);
        } else {
          setError('Profile not found');
        }

        // Set document title with the username
        document.title = `${username}'s Profile | Eventify`;
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('An error occurred while fetching the profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);
  
  // Fetch events created by the user
  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!username) return;
      
      try {
        setEventsLoading(true);
        const { data } = await axiosInstance.get(`/events/?owner__username=${username}`);
        setUserEvents(data);
      } catch (err) {
        console.error('Error fetching user events:', err);
      } finally {
        setEventsLoading(false);
      }
    };
    
    fetchUserEvents();
  }, [username]);
  
  // Fetch events the user is attending
  useEffect(() => {
    const fetchAttendingEvents = async () => {
      if (!username) return;
      
      try {
        setAttendingLoading(true);
        // Now our backend supports filtering by owner__username
        const { data: attendances } = await axiosInstance.get(`/attendees/?owner__username=${username}`);
        
        if (attendances.results.length > 0) {
          // Extract event IDs from attendances
          const eventIds = attendances.results.map(attendance => attendance.event);
          
          // Get events by IDs
          const promises = eventIds.map(eventId => 
            axiosInstance.get(`/events/${eventId}/`)
          );
          
          const eventsResponses = await Promise.all(promises);
          const events = {
            results: eventsResponses.map(response => response.data)
          };
          
          setAttendingEvents(events);
        } else {
          setAttendingEvents({ results: [] });
        }
      } catch (err) {
        console.error('Error fetching attending events:', err);
      } finally {
        setAttendingLoading(false);
      }
    };
    
    fetchAttendingEvents();
  }, [username]);
  
  // Fetch events the user has favorited
  useEffect(() => {
    const fetchFavoriteEvents = async () => {
      if (!username) return;
      
      try {
        setFavoritesLoading(true);
        console.log(`Fetching favorites for user: ${username}`);
        
        // Get the user's favorites directly from the Django backend
        const { data: favorites } = await axiosInstance.get(`/favorites/?owner__username=${username}`);
        console.log(`Found ${favorites.results.length} favorites`);
        
        if (favorites.results.length > 0) {
          // Extract event IDs from favorites
          const eventIds = favorites.results.map(favorite => favorite.event);
          console.log('Event IDs from favorites:', eventIds);
          
          // Get events by IDs
          const promises = eventIds.map(eventId => 
            axiosInstance.get(`/events/${eventId}/`)
          );
          
          const eventsResponses = await Promise.all(promises);
          const events = {
            results: eventsResponses.map(response => response.data)
          };
          
          console.log(`Retrieved ${events.results.length} favorited events for ${username}`);
          setFavoriteEvents(events);
        } else {
          console.log(`No favorites found for ${username}`);
          setFavoriteEvents({ results: [] });
        }
      } catch (err) {
        console.error('Error fetching favorite events:', err);
      } finally {
        setFavoritesLoading(false);
      }
    };
    
    fetchFavoriteEvents();
  }, [username]);

  // Handle follow/unfollow actions
  const handleFollow = async (profileId) => {
    try {
      // Create a new follower relationship
      const { data } = await axiosInstance.post('/followers/', {
        followed: profileId
      });
      
      // Update this profile's UI to show following
      setProfile(prevProfile => ({
        ...prevProfile,
        followers_count: prevProfile.followers_count + 1,
        following_id: data.id
      }));
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleUnfollow = async (followingId) => {
    try {
      await axiosInstance.delete(`/followers/${followingId}/`);
      
      // Update this profile's UI to show not following
      setProfile(prevProfile => ({
        ...prevProfile,
        followers_count: prevProfile.followers_count - 1,
        following_id: null
      }));
    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={12}>
          {profile && (
            <Profile 
              {...profile} 
              handleFollow={handleFollow}
              handleUnfollow={handleUnfollow}
            />
          )}
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col>
          <Nav 
            variant="tabs" 
            className={styles.ProfileTabs}
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
          >
            <Nav.Item>
              <Nav.Link eventKey="events">
                Events
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="attending">
                Attending
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="favorites">
                Favorites
              </Nav.Link>
            </Nav.Item>
          </Nav>
          
          {/* Content based on selected tab */}
          <div className="p-3 bg-light rounded">
            {activeTab === 'events' && (
              <>
                {eventsLoading ? (
                  <Asset spinner />
                ) : userEvents.results.length ? (
                  <Row>
                    {userEvents.results.map(event => (
                      <Col md={6} lg={4} key={event.id} className="mb-4">
                        <EventCard event={event} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-muted text-center py-5">
                    {isOwner ? "You haven't created any events yet" : `${profile.owner} hasn't created any events yet`}
                  </p>
                )}
              </>
            )}
            {activeTab === 'attending' && (
              <>
                {attendingLoading ? (
                  <Asset spinner />
                ) : attendingEvents.results.length ? (
                  <Row>
                    {attendingEvents.results.map(event => (
                      <Col md={6} lg={4} key={event.id} className="mb-4">
                        <EventCard event={event} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-muted text-center py-5">
                    {isOwner ? "You're not attending any events yet" : `${profile.owner} isn't attending any events yet`}
                  </p>
                )}
              </>
            )}
            {activeTab === 'favorites' && (
              <>
                {favoritesLoading ? (
                  <Asset spinner />
                ) : favoriteEvents.results.length ? (
                  <Row>
                    {favoriteEvents.results.map(event => (
                      <Col md={6} lg={4} key={event.id} className="mb-4">
                        <EventCard event={event} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-muted text-center py-5">
                    {isOwner ? "You haven't favorited any events yet" : `${profile.owner} hasn't favorited any events yet`}
                  </p>
                )}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;