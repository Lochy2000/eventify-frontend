import React from 'react';
import { Container, Row, Col, Image, Card, Button } from 'react-bootstrap';
import styles from '../../styles/Profile.module.css';
import { Link } from 'react-router-dom';

const Profile = (props) => {
  const { 
    id, 
    owner, 
    name,
    bio, 
    location,
    avatar, 
    is_owner, 
    followers_count, 
    following_count,
    following_id,
    handleFollow,
    handleUnfollow,
  } = props;

  return (
    <Card className={styles.Profile}>
      <Card.Body>
        <Row className="align-items-center mb-4">
          <Col xs={12} md={3} className="text-center">
            <Image 
              src={avatar} 
              alt={`${owner}'s profile`} 
              roundedCircle 
              className={styles.ProfileAvatar} 
            />
          </Col>
          <Col xs={12} md={9}>
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div>
                <h2>{name || owner}</h2>
                <p className="text-muted">@{owner}</p>
                {location && <p><i className="fa fa-map-marker"></i> {location}</p>}
              </div>
              <div className="d-flex mt-2 mt-md-0">
                {is_owner ? (
                  <Button 
                    as={Link} 
                    to={`/profile/${owner}/edit`}
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                  >
                    Edit Profile
                  </Button>
                ) : following_id ? (
                  <Button 
                    onClick={() => handleUnfollow(following_id)}
                    variant="outline-secondary"
                    size="sm"
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleFollow(id)}
                    variant="success"
                    size="sm"
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>
            
            <div className="d-flex mt-2">
              <div className={styles.Stats}>
                <span className={styles.StatCount}>{followers_count}</span>
                <span className={styles.StatLabel}>followers</span>
              </div>
              <div className={styles.Stats}>
                <span className={styles.StatCount}>{following_count}</span>
                <span className={styles.StatLabel}>following</span>
              </div>
            </div>
          </Col>
        </Row>

        {bio && (
          <Row>
            <Col>
              <h4>About</h4>
              <p>{bio}</p>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default Profile;