//src/components/common/Footer.js
import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light py-3 mt-auto">
      <Container>
        <div className="text-center">
          <p className="mb-0">© {new Date().getFullYear()} Eventify. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;