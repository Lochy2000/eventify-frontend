import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import axiosInstance from '../../api/axiosDefaults';
import Asset from '../common/Asset';
import styles from '../../styles/CommentList.module.css';

/**
 * Component to display a list of comments for an event
 * 
 * @param {Object} props Component props
 * @param {number} props.eventId - ID of the event to show comments for
 * @param {Object} props.event - Event data
 * @param {Function} props.setEvent - Function to update parent event state
 */
const CommentList = ({ eventId, event, setEvent }) => {
  // State for comments data
  const [comments, setComments] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();
  
  // Fetch comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axiosInstance.get(`/comments/?event=${eventId}`);
        setComments(data);
        setLoading(false);
      } catch (err) {
        // Using console.error is appropriate for actual errors
        console.error('Error fetching comments:', err);
        setLoading(false);
      }
    };

    fetchComments();
  }, [eventId]);
  
  return (
    <div className={styles.CommentSection}>
      <h4 className="mb-3">Comments ({comments.results?.length || 0})</h4>
      
      {/* Comment form for logged in users */}
      {currentUser && (
        <CommentForm
          eventId={eventId}
          setComments={setComments}
          setEvent={setEvent}
        />
      )}
      
      {/* Comments list with loading state */}
      {loading ? (
        <div className="text-center">
          <Asset spinner />
        </div>
      ) : comments.results?.length ? (
        <ListGroup variant="flush" className={styles.CommentList}>
          {comments.results.map(comment => (
            <ListGroup.Item key={comment.id} className={styles.CommentItem}>
              <Comment
                comment={comment}
                setComments={setComments}
                setEvent={setEvent}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-center text-muted mt-4">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
};

export default CommentList;
