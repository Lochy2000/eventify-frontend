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
  return (
    <span>
      {src ? (
        <img
          className={styles.Avatar}
          src={src}
          height={height}
          width={height}
          alt="Avatar"
        />
      ) : (
        <div
          className={styles.AvatarText}
          style={{ height, width: height }}
        >
          {text?.slice(0, 2).toUpperCase() || '?'}
        </div>
      )}
    </span>
  );
};

export default Avatar;
