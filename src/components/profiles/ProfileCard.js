import React from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from '../../styles/ProfileCard.module.css';

const ProfileCard = ({ profile, handleFollow, handleUnfollow }) => {
  const {
    id,
    owner,
    name,
    avatar,
    location,
    following_id,
  } = profile;

  return (
    <Card className={styles.ProfileCard}>
      <Card.Body className="text-center p-3">
        <Link to={`/profile/${owner}`} className={styles.ProfileLink}>
          <Image 
            src={avatar} 
            alt={`${owner}'s profile`} 
            roundedCircle 
            className={styles.Avatar}
          />
          
          <Card.Title className="mt-3 mb-1">
            {name || owner}
          </Card.Title>
        </Link>
        
        <Card.Subtitle className="mb-2 text-muted">
          @{owner}
        </Card.Subtitle>
        
        {location && (
          <Card.Text className="small text-muted mb-3">
            <i className="fa fa-map-marker me-1"></i> {location}
          </Card.Text>
        )}
        
        {following_id ? (
          <Button 
            onClick={() => handleUnfollow(following_id)}
            variant="outline-secondary"
            size="sm"
            className={styles.FollowButton}
          >
            Following
          </Button>
        ) : (
          <Button 
            onClick={() => handleFollow(id)}
            variant="success"
            size="sm"
            className={styles.FollowButton}
          >
            Follow
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;