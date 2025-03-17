import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosDefaults';
import EventCard from './EventCard';
import Asset from '../common/Asset';
import styles from '../../styles/EventList.module.css';
import { fetchMoreData } from '../../utils/utils';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

/**
 * Component for displaying a list of events with filtering options
 * 
 * @param {Object} props Component props
 * @param {string} props.message - Message to display when there are no events
 * @param {string} props.filter - URL parameter to filter events by
 */
const EventList = ({ message, filter = "" }) => {
  const [events, setEvents] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const currentUser = useCurrentUser();
  const { pathname } = useLocation();
  
  // Fetch events when component mounts or filters change
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Log the request URL for debugging
        const requestUrl = `/events/?${filter}search=${query}&category=${category}`;
        console.log('Fetching events with URL:', requestUrl);
        
        const { data } = await axiosInstance.get(requestUrl);
        console.log('Received events data:', data);
        setEvents(data);
        setHasLoaded(true);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    // Reset loaded state when filters change
    setHasLoaded(false);
    
    // Use a small delay to avoid too many API calls while typing
    const timer = setTimeout(() => {
      fetchEvents();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, category, pathname, currentUser]);

  return (
    <Container className={styles.EventListContainer}>
      <Row className="mb-4">
        <Col md={4} className="position-relative">
          <i className={`fas fa-search ${styles.SearchIcon}`} />
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className={styles.SearchBar}
            placeholder="Search events"
          />
        </Col>
        <Col md={4}>
          <Form.Group controlId="category">
            <Form.Control
              as="select"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All Categories</option>
              <option value="music">Music</option>
              <option value="tech">Technology</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts</option>
              <option value="food">Food</option>
              <option value="outdoors">Outdoors</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex justify-content-end align-items-center">
          {currentUser && (
            <Button
              className="btn-success"
              onClick={() => window.location.href = "/events/create"}
            >
              Create Event
            </Button>
          )}
        </Col>
      </Row>

      {hasLoaded ? (
        <>
          {events.results.length ? (
            <Row>
              {events.results.map((event) => (
                <Col md={6} lg={4} key={event.id} className="mb-4">
                  <EventCard event={event} />
                </Col>
              ))}
              {events.next && (
                <Col className="d-flex justify-content-center">
                  <Button
                    onClick={() => fetchMoreData(events, setEvents)}
                    variant="outline-secondary"
                  >
                    Load More
                  </Button>
                </Col>
              )}
            </Row>
          ) : (
            <Container>
              <Asset message={message} />
            </Container>
          )}
        </>
      ) : (
        <Container>
          <Asset spinner />
        </Container>
      )}
    </Container>
  );
};

export default EventList;

EventList.propTypes = {
  message: PropTypes.string,
  filter: PropTypes.string,
};

EventList.defaultProps = {
  message: "No events found. Try adjusting your search.",
  filter: "",
};
