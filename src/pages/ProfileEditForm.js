import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Image, Container, Alert, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosDefaults';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import Asset from '../components/common/Asset';
import appStyles from '../App.css';

const ProfileEditForm = () => {
  const { username } = useParams();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    avatar: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/profiles/');
        const profile = data.results.find(profile => profile.owner === username);
        
        if (profile) {
          setProfileData({
            name: profile.name || '',
            bio: profile.bio || '',
            location: profile.location || '',
            avatar: profile.avatar || '',
          });
          setImagePreview(profile.avatar);
          setLoading(false);
        } else {
          setErrors({ message: 'Profile not found' });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setErrors({ message: 'Error fetching profile' });
        setLoading(false);
      }
    };

    // Only fetch if the user is logged in and it's their profile
    if (currentUser?.username === username) {
      fetchProfile();
    } else {
      // If not the owner, redirect to profile page
      navigate(`/profile/${username}`);
    }
  }, [currentUser, username, navigate]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    if (event.target.files.length) {
      const file = event.target.files[0];
      setProfileData({
        ...profileData,
        avatar: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    
    // Only add the avatar if it's a file (not a string URL)
    if (profileData.avatar && typeof profileData.avatar !== 'string') {
      formData.append('avatar', profileData.avatar);
      console.log('Adding avatar file to form data', profileData.avatar.name);
    } else {
      // Log to help debug if avatar is a string or missing
      console.log('Avatar is a string or undefined:', profileData.avatar);
    }
    
    formData.append('name', profileData.name);
    formData.append('bio', profileData.bio);
    formData.append('location', profileData.location);

    try {
      setLoading(true);
      // Check if we have the profile ID
      const { data: profilesData } = await axiosInstance.get('/profiles/');
      const profile = profilesData.results.find(p => p.owner === username);
      
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Add more debug logging
      console.log('Updating profile with ID:', profile.id);
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (key === 'avatar' && value instanceof File) {
          console.log(`${key}: ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Update the profile
      const response = await axiosInstance.put(`/profiles/${profile.id}/`, formData);
      console.log('Profile update response:', response.data);
      
      // Force a reload to make sure we get fresh data
      window.location.href = `/profile/${username}`;
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrors(err.response?.data || { message: 'Error updating profile' });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Asset spinner />
        <p>Loading profile data...</p>
      </Container>
    );
  }

  if (errors.message) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{errors.message}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Edit Profile</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4} className="text-center mb-4">
            {imagePreview && (
              <div className="mb-3">
                <Image 
                  src={imagePreview} 
                  alt="Profile preview" 
                  roundedCircle 
                  className="mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
            )}
            <Form.Group controlId="avatar">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={imageInputRef}
              />
              {errors.avatar?.map((message, idx) => (
                <Alert variant="danger" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
          </Col>
          
          <Col md={8}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
              />
              {errors.name?.map((message, idx) => (
                <Alert variant="danger" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleChange}
              />
              {errors.location?.map((message, idx) => (
                <Alert variant="danger" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
              />
              {errors.bio?.map((message, idx) => (
                <Alert variant="danger" key={idx}>
                  {message}
                </Alert>
              ))}
            </Form.Group>
          </Col>
        </Row>
        
        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="secondary"
            className="me-2"
            onClick={() => navigate(`/profile/${username}`)}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ProfileEditForm;
