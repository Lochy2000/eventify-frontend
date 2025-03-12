import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import axiosInstance from '../api/axiosDefaults';
import ProfileCard from '../components/profiles/ProfileCard';
import styles from '../styles/PeoplePage.module.css';
import { useCurrentUser } from '../contexts/CurrentUserContext';

const PeoplePage = () => {
  const currentUser = useCurrentUser();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all profiles
        const { data } = await axiosInstance.get('/profiles/');
        
        // Filter out the current user's profile
        const otherProfiles = currentUser 
          ? data.results.filter(profile => profile.owner !== currentUser?.username) 
          : data.results;
        
        setProfiles(otherProfiles);
        setFilteredProfiles(otherProfiles);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('An error occurred while fetching user profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [currentUser]);

  // Filter profiles based on search query
  useEffect(() => {
    const filtered = profiles.filter(profile => {
      const username = profile.owner.toLowerCase();
      const displayName = (profile.name || '').toLowerCase();
      const location = (profile.location || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      
      return username.includes(query) || 
             displayName.includes(query) || 
             location.includes(query);
    });
    
    setFilteredProfiles(filtered);
  }, [searchQuery, profiles]);

  const handleFollow = async (profileId) => {
    if (!currentUser) {
      // Redirect to login if not logged in
      return;
    }
    
    try {
      const { data } = await axiosInstance.post('/followers/', {
        followed: profileId
      });
      
      // Update profile UI to show following
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === profileId 
            ? { ...profile, following_id: data.id, followers_count: profile.followers_count + 1 } 
            : profile
        )
      );
      
      // Update filtered profiles too
      setFilteredProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === profileId 
            ? { ...profile, following_id: data.id, followers_count: profile.followers_count + 1 } 
            : profile
        )
      );
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleUnfollow = async (followingId) => {
    try {
      await axiosInstance.delete(`/followers/${followingId}/`);
      
      // Update profile UI to show not following
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.following_id === followingId 
            ? { ...profile, following_id: null, followers_count: profile.followers_count - 1 } 
            : profile
        )
      );
      
      // Update filtered profiles too
      setFilteredProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.following_id === followingId 
            ? { ...profile, following_id: null, followers_count: profile.followers_count - 1 } 
            : profile
        )
      );
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
      <h1 className="mb-4">People on Eventify</h1>
      
      <Form className="mb-4">
        <Form.Group controlId="searchProfiles">
          <Form.Control
            type="text"
            placeholder="Search by name, username or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.SearchInput}
          />
        </Form.Group>
      </Form>
      
      {filteredProfiles.length === 0 ? (
        <Alert variant="info">
          No users found matching your search criteria.
        </Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredProfiles.map(profile => (
            <Col key={profile.id}>
              <ProfileCard 
                profile={profile} 
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PeoplePage;