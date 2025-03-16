import React from 'react';
import styles from '../../styles/Avatar.module.css';

/**
 * Avatar component for displaying user profile images
 * 
 * @param {Object} props Component props
 * @param {string} props.src - Image source URL
 * @param {number} props.height - Image height in pixels
 * @param {string} props.text - Text to display if no image is available
 */
const Avatar = ({ src, height = 45, text }) => {
  // Add console log for debugging avatar URLs
  console.log(`Avatar src for ${text}:`, src);
  
  // Set a default avatar URL if src is undefined or empty
  const avatarSrc = src || 'https://res.cloudinary.com/dpw2txejq/image/upload/default_profile_ju9xum';
  
  return (
    <span className={styles.AvatarContainer}>
      <img
        className={styles.Avatar}
        src={avatarSrc}
        height={height}
        width={height}
        alt="Avatar"
        onError={(e) => {
          console.error(`Error loading avatar image for ${text}:`, e.target.src);
          // Fall back to initials if image fails to load
          e.target.style.display = 'none';
        }}
      />
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

export default Avatar;
