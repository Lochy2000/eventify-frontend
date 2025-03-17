/**
 * Helper utilities for managing Cloudinary images
 */

// Your Cloudinary cloud name - hardcoded for reliability
const CLOUD_NAME = 'dpw2txejq';

// Base URL for Cloudinary images
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// Different folders in your Cloudinary account
const FOLDERS = {
  HOMEPAGE: 'v1742252542',
  PROFILES: 'profiles',
  EVENTS: 'events'
};

/**
 * Get a Cloudinary URL for a homepage image
 * 
 * @param {string} publicId - The public ID of the image
 * @returns {string} - The complete Cloudinary URL
 */
export const getHomepageImage = (publicId) => {
  return `${CLOUDINARY_BASE_URL}/${FOLDERS.HOMEPAGE}/${publicId}`;
};

/**
 * Get a Cloudinary URL for a user-uploaded image (events or profiles)
 * 
 * @param {string} publicId - The public ID of the image
 * @param {string} type - The type of image ('events' or 'profiles')
 * @returns {string} - The complete Cloudinary URL
 */
export const getUploadedImage = (publicId, type = 'events') => {
  if (!publicId) {
    return getDefaultImage(type);
  }
  
  return `${CLOUDINARY_BASE_URL}/${publicId}`;
};

/**
 * Get a default image when an image is not available
 * 
 * @param {string} type - The type of image ('events' or 'profiles')
 * @returns {string} - The URL to the default image
 */
export const getDefaultImage = (type) => {
  const defaultImages = {
    events: 'default_post_o0lbny',
    profiles: 'default_profile_ju9xum'
  };
  
  return `${CLOUDINARY_BASE_URL}/${defaultImages[type] || defaultImages.events}`;
};