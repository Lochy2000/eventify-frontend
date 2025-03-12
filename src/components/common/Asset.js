import React from 'react';
import { Spinner } from 'react-bootstrap';
import styles from '../../styles/Asset.module.css';

/**
 * Asset component for displaying loading spinners, images, and messages
 * 
 * @param {Object} props Component props
 * @param {boolean} props.spinner - Whether to show a loading spinner
 * @param {string} props.src - Image source URL
 * @param {string} props.message - Message to display below the image or spinner
 */
const Asset = ({ spinner, src, message }) => {
  return (
    <div className={styles.Asset}>
      {spinner && <Spinner animation="border" />}
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Asset;
