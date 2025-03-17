import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axiosInstance from '../../api/axiosDefaults';
import styles from '../../styles/CommentForm.module.css';

/**
 * Component for creating comments on events
 * 
 * @param {Object} props Component props
 * @param {number} props.eventId - ID of the event to comment on
 * @param {Function} props.setComments - Function to update comments list when new comment is added
 * @param {Function} props.setEvent - Function to update event comment count
 */
const CommentForm = ({ eventId, setComments, setEvent }) => {
  // State for form content and errors
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setSubmitting(true);
    setErrors({});
    
    try {
      const { data } = await axiosInstance.post('/comments/', {
        event: eventId,
        content: content.trim(),
      });
      
      // Update comments list with new comment
      setComments(prevComments => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      
      // Update event comment count
      setEvent(prevEvent => ({
        results: [{
          ...prevEvent.results[0],
          comments_count: prevEvent.results[0].comments_count + 1,
        }],
      }));
      
      // Clear form
      setContent('');
    } catch (err) {
      // Using console.error is appropriate for actual errors
      console.error('Error posting comment:', err);
      setErrors(err.response?.data || { non_field_errors: ['An error occurred while posting your comment.'] });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Form className={styles.CommentForm} onSubmit={handleSubmit}>
      <Form.Group controlId="content">
        <Form.Label className="d-none">Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Write your comment here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.CommentInput}
        />
      </Form.Group>
      
      {errors.content?.map((message, idx) => (
        <Alert variant="danger" key={idx}>{message}</Alert>
      ))}
      
      {errors.non_field_errors?.map((message, idx) => (
        <Alert variant="danger" key={idx}>{message}</Alert>
      ))}
      
      <div className="d-flex justify-content-end mt-2">
        <Button
          variant="primary"
          type="submit"
          className={styles.CommentSubmitButton}
          disabled={!content.trim() || submitting}
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </Form>
  );
};

export default CommentForm;
