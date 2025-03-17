import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Avatar.module.css';

/**
 * Component for displaying user avatars with fallback to initials
 * 
 * This component renders either the user's avatar image or their initials
 * in a circle if the image is not available or fails to load.
 * 
 * @param {Object} props Component props
 * @param {string} props.src - Image source URL
 * @param {number} props.height - Image height in pixels
 * @param {string} props.text - Text to display if no image is available (typically username)
 * @returns {JSX.Element} Avatar component
 */
const Avatar = ({ src, height = 45, text }) => {
  // Set a default avatar URL if src is undefined or empty
  const avatarSrc = src || 'https://res.cloudinary.com/dpw2txejq/image/upload/default_profile_ju9xum';
  
  return (
    <span className={styles.AvatarContainer}>
      {/* Image element for avatar */}
      <img
        className={styles.Avatar}
        src={avatarSrc}
        height={height}
        width={height}
        alt="Avatar"
        onError={(e) => {
          // Hide the image if it fails to load
          e.target.style.display = 'none';
        }}
      />
      
      {/* Fallback to initials if image fails to load */}
      <div
        className={styles.AvatarText}
        style={{
          height,
          width: height,
          display: 'flex' // Always create the element but it might be hidden by the image
        }}
        data-testid="avatar-initials"
      >
        {text?.slice(0, 2).toUpperCase() || '?'}
      </div>
    </span>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  height: PropTypes.number,
  text: PropTypes.string,
};

export default Avatar;
