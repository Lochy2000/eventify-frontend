import React from 'react';
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