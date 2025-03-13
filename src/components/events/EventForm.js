import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Row, Col, Container, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/EventForm.module.css';
import axiosInstance from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

/**
 * Form component for creating and editing events
 * 
 * @param {Object} props Component props
 * @param {Object} props.event - Event data for editing (null for creation)
 */
const EventForm = ({ event }) => {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const imageInput = useRef(null);
  const isEditMode = !!event; // Check if we're editing an existing event

  // Initial form state 
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    price: 0,
    cover: '',
  });

  const { title, description, date, time, location, category, price, cover } = eventData;
  
  // For form validation and errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If editing, populate form with existing event data
  useEffect(() => {
    if (isEditMode) {
      // Format date and time for form inputs
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toISOString().split('T')[0];
      const formattedTime = eventDate.toTimeString().slice(0, 5);

      setEventData({
        title: event.title,
        description: event.description,
        date: formattedDate,
        time: formattedTime,
        location: event.location,
        category: event.category,
        price: event.price,
        cover: event.cover,
      });
    }
  }, [event, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleChangeImage = (e) => {
    if (e.target.files.length) {
      URL.revokeObjectURL(cover);
      setEventData({
        ...eventData,
        cover: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Combine date and time into a single date string
    const dateTime = `${date}T${time}:00`;

    // Create form data for submission
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', dateTime);
    formData.append('location', location);
    formData.append('category', category);
    formData.append('price', price);

    // Only append image if it's a new file (not a URL)
    if (imageInput?.current?.files[0]) {
      formData.append('cover', imageInput.current.files[0]);
    }

    try {
      if (isEditMode) {
        // Update existing event
        await axiosInstance.put(`/events/${event.id}/`, formData);
        // Show success message
        alert('Event updated successfully!');
        navigate(`/events/${event.id}`);
      } else {
        // Create new event
        const { data } = await axiosInstance.post('/events/', formData);
        // Show success message
        alert('Event created successfully!');
        navigate(`/events/${data.id}`);
      }
    } catch (err) {
      console.error('Error submitting event form:', err);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['An error occurred. Please try again.'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if user is not logged in
  if (!currentUser) {
    navigate('/signin');
    return null;
  }

  return (
    <Container className={styles.FormContainer}>
      <h1 className="text-center mb-4">
        {isEditMode ? 'Edit Event' : 'Create Event'}
      </h1>

      <Form onSubmit={handleSubmit}>
        {/* Display form-wide errors */}
        {errors.non_field_errors?.map((message, idx) => (
          <Alert variant="danger" key={idx}>
            {message}
          </Alert>
        ))}

        <Row>
          <Col md={6}>
            {/* Event Title */}
            <Form.Group controlId="title">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
                required
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Date and Time */}
            <Row>
              <Col>
                <Form.Group controlId="date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={date}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.date?.map((message, idx) => (
                      <p key={idx}>{message}</p>
                    ))}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="time">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={time}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.time}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.time?.map((message, idx) => (
                      <p key={idx}>{message}</p>
                    ))}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Location */}
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={location}
                onChange={handleChange}
                required
                isInvalid={!!errors.location}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Category */}
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={category}
                onChange={handleChange}
                required
                isInvalid={!!errors.category}
              >
                <option value="">Select a category</option>
                <option value="music">Music</option>
                <option value="tech">Technology</option>
                <option value="sports">Sports</option>
                <option value="arts">Arts</option>
                <option value="food">Food</option>
                <option value="outdoors">Outdoors</option>
                <option value="other">Other</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.category?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Price */}
            <Form.Group controlId="price">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.price?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            {/* Image Upload */}
            <Form.Group controlId="cover" className={styles.ImageUpload}>
              <Form.Label>Event Image</Form.Label>
              {cover ? (
                <div className={styles.ImagePreview}>
                  <Image className={styles.Image} src={cover} rounded />
                </div>
              ) : (
                <div className={styles.UploadIcon}>
                  <i className="fas fa-upload fa-3x" />
                  <p>Click or drag to upload an image</p>
                </div>
              )}

              <Form.Control
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={handleChangeImage}
                className={styles.FileInput}
                isInvalid={!!errors.cover}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cover?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Description */}
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                name="description"
                value={description}
                onChange={handleChange}
                required
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.map((message, idx) => (
                  <p key={idx}>{message}</p>
                ))}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Form Buttons */}
        <div className="d-flex justify-content-between mt-3">
          <Button
            variant="outline-secondary"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EventForm;
