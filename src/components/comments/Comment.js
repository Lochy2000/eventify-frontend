import React, { useState } from 'react';
import { Card, OverlayTrigger, Tooltip, Modal, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosDefaults';
import Avatar from '../common/Avatar';
import styles from '../../styles/Comment.module.css';
import { formatDistanceToNow } from 'date-fns';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

/**
 * Component to display a single comment with editing and deletion capability
 * 
 * @param {Object} props Component props
 * @param {Object} props.comment - Comment data to display
 * @param {Function} props.setEvent - Function to update parent event state when comment is modified
 * @param {Function} props.setComments - Function to update comments list when comment is modified
 */
const Comment = ({ comment, setEvent, setComments }) => {
  // State and hooks
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [commentContent, setCommentContent] = useState(comment.content);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const currentUser = useCurrentUser();
  
  // Check if current user is the comment owner
  const isOwner = currentUser?.username === comment.owner;
  
  // Format creation date as "X time ago"
  const formattedDate = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });
  
  // Handle comment deletion
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/comments/${comment.id}/`);
      
      // Update comments list by removing this comment
      setComments(prevComments => ({
        ...prevComments,
        results: prevComments.results.filter(c => c.id !== comment.id),
      }));
      
      // Update event comment count
      setEvent(prevEvent => ({
        results: [{
          ...prevEvent.results[0],
          comments_count: prevEvent.results[0].comments_count - 1,
        }],
      }));
      
      // Close modal
      setShowDeleteModal(false);
    } catch (err) {
      // Using console.error is appropriate for actual errors
      console.error('Error deleting comment:', err);
    }
  };
  
  // Handle comment edit submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    setSubmitting(true);
    setErrors({});
    
    try {
      const { data } = await axiosInstance.put(`/comments/${comment.id}/`, {
        content: commentContent.trim(),
      });
      
      // Update comments list with edited comment
      setComments(prevComments => ({
        ...prevComments,
        results: prevComments.results.map(c => 
          c.id === comment.id ? data : c
        ),
      }));
      
      // Exit edit mode
      setShowEditForm(false);
    } catch (err) {
      // Using console.error is appropriate for actual errors
      console.error('Error editing comment:', err);
      setErrors(err.response?.data || { non_field_errors: ['An error occurred while updating your comment.'] });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Card className={styles.Comment}>
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          <Link to={`/profile/${comment.owner}`} className="d-flex align-items-center me-auto">
            <Avatar src={comment.profile_image} height={40} text={comment.owner} />
            <span className="ms-2 fw-bold">{comment.owner}</span>
          </Link>
          <small className="text-muted">{formattedDate}</small>
        </div>
        
        {showEditForm ? (
          <Form onSubmit={handleEditSubmit}>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
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
                variant="outline-secondary"
                onClick={() => setShowEditForm(false)}
                disabled={submitting}
                className="me-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!commentContent.trim() || submitting}
              >
                {submitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <Card.Text>{commentContent}</Card.Text>
            
            {isOwner && (
              <div className="d-flex justify-content-end mt-2">
                <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                  <Button 
                    variant="link" 
                    className={styles.CommentActionButton}
                    onClick={() => setShowEditForm(true)}
                  >
                    <i className="fas fa-edit" />
                  </Button>
                </OverlayTrigger>
                
                <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                  <Button 
                    variant="link" 
                    className={styles.CommentActionButton}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <i className="fas fa-trash" />
                  </Button>
                </OverlayTrigger>
              </div>
            )}
          </>
        )}
      </Card.Body>
      
      {/* Delete confirmation modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this comment? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Comment;
