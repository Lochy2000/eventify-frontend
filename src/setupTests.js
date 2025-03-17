// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Setup mocks for tests
const setupTestMocks = () => {
  // Mock URL.createObjectURL
  if (typeof window !== 'undefined') {
    window.URL.createObjectURL = () => {};
    window.URL.revokeObjectURL = () => {};
  }

  // Mock for matchMedia which is not available in test environment
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {}, // deprecated
        removeListener: () => {}, // deprecated
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      }),
    });
  }

  // Mock for IntersectionObserver which is not available in test environment
  class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  }

  if (typeof window !== 'undefined') {
    window.IntersectionObserver = MockIntersectionObserver;
  }
};

setupTestMocks();
