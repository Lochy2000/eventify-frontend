import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button, Nav } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Profile from '../components/profiles/Profile';
import axiosInstance from '../api/axiosDefaults';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import Alert from 'react-bootstrap/Alert';
import styles from '../styles/ProfilePage.module.css';

const ProfilePage = () => {
  const { username } = useParams();
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');

  const isOwner = currentUser?.username === username;

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
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('An error occurred while fetching the profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
          
          {/* Content based on selected tab - placeholder for now */}
          <div className="p-3 bg-light rounded">
            {activeTab === 'events' && (
              <p className="text-muted text-center py-5">
                {isOwner ? "You haven't created any events yet" : `${profile.owner} hasn't created any events yet`}
              </p>
            )}
            {activeTab === 'attending' && (
              <p className="text-muted text-center py-5">
                {isOwner ? "You're not attending any events yet" : `${profile.owner} isn't attending any events yet`}
              </p>
            )}
            {activeTab === 'favorites' && (
              <p className="text-muted text-center py-5">
                {isOwner ? "You haven't favorited any events yet" : `${profile.owner} hasn't favorited any events yet`}
              </p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;