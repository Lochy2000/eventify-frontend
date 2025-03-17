import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import styles from '../styles/HomePage.module.css';
import { getHomepageImage } from '../utils/cloudinaryHelper';

/**
 * Landing page component for the application
 * 
 * Displays a welcome message, features, and call-to-action buttons
 */
const HomePage = () => {
  const currentUser = useCurrentUser();

  return (
    <div className={styles.HomePageContainer}>
      {/* Hero Section */}
      <section className={styles.HeroSection}>
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <img 
                src={getHomepageImage('logo_sc94ub.jpg')} 
                alt="Eventify Logo" 
                className={styles.HeroLogo}
              />
              <h1 className={styles.HeroTitle}>
                Connect, Discover & Experience
              </h1>
              <p className={styles.HeroSubtitle}>
                Your one-stop platform for finding and organizing events that matter.
              </p>
              <div className={styles.HeroButtons}>
                {currentUser ? (
                  <Button 
                    as={Link} 
                    to="/events" 
                    variant="success" 
                    size="lg" 
                    className="me-3"
                  >
                    Discover Events
                  </Button>
                ) : (
                  <>
                    <Button 
                      as={Link} 
                      to="/signin" 
                      variant="outline-primary" 
                      size="lg" 
                      className="me-3"
                    >
                      Sign In
                    </Button>
                    <Button 
                      as={Link} 
                      to="/signup" 
                      variant="primary" 
                      size="lg"
                    >
                      Join Now
                    </Button>
                  </>
                )}
              </div>
            </Col>
            <Col md={6} className="mt-4 mt-md-0">
              <img 
                src={getHomepageImage('people_xzad7b.png')} 
                alt="Event Peopl" 
                className={styles.HeroImage}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className={styles.FeaturesSection}>
        <Container>
          <h2 className="text-center mb-5">Why Choose Eventify</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className={styles.FeatureCard}>
                <Card.Body className="text-center">
                  <div className={styles.FeatureIcon}>
                    <img 
                      src={getHomepageImage('calender_gpibzw.png')} 
                      alt="Connect Calendar" 
                      height="80"
                    />
                  </div>
                  <Card.Title>Connect</Card.Title>
                  <Card.Text>
                    Build your network by connecting with other event enthusiasts and organizers.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className={styles.FeatureCard}>
                <Card.Body className="text-center">
                  <div className={styles.FeatureIcon}>
                    <img 
                      src={getHomepageImage('fistbump_ibozaq.gif')} 
                      alt="Experience Icon" 
                      height="80"
                    />
                  </div>
                  <Card.Title>Participate</Card.Title>
                  <Card.Text>
                    Register for events with just one click and manage your attendance easily.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className={styles.FeatureCard}>
                <Card.Body className="text-center">
                  <div className={styles.FeatureIcon}>
                    <img 
                      src={getHomepageImage('stars_f4e64m.gif')} 
                      alt="Discover Icon" 
                      height="80"
                    />
                  </div>
                  <Card.Title>Discover</Card.Title>
                  <Card.Text>
                    Find events that match your interests through our smart search and filters.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className={styles.CtaSection}>
        <Container className="text-center">
          <h2 className="mb-4">Ready to dive in?</h2>
          <p className="mb-4">
            Join thousands of users who are already discovering and sharing amazing events.
          </p>
          {!currentUser && (
            <Button as={Link} to="/signup" variant="success" size="lg">
              Get Started Now
            </Button>
          )}
          {currentUser && (
            <Button as={Link} to="/events/create" variant="success" size="lg">
              Create Your First Event
            </Button>
          )}
        </Container>
      </section>
    </div>
  );
};

export default HomePage;