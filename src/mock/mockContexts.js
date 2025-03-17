import React from 'react';
import PropTypes from 'prop-types';
// Mock jest function for testing
/* eslint-disable no-undef */
import { CurrentUserContext, SetCurrentUserContext } from '../contexts/CurrentUserContext';

export const MockCurrentUserProvider = ({ children, currentUser = null }) => {
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={jest.fn()}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

MockCurrentUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
  currentUser: PropTypes.object,
};