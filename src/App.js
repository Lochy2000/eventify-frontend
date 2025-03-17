import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components using index files
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';


// Import pages
import SignInForm from './pages/auth/SignInForm';
import SignUpForm from './pages/auth/SignUpForm';
import EventsPage from './pages/events/EventsPage';
import EventDetailPage from './pages/events/EventDetailPage';
import EventCreatePage from './pages/events/EventCreatePage';
import EventEditPage from './pages/events/EventEditPage';
import EventAttendeesPage from './pages/events/EventAttendeesPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditForm from './pages/ProfileEditForm';
import PeoplePage from './pages/PeoplePage';
import HomePage from './pages/HomePage';

// Context provider
import { CurrentUserProvider } from './contexts/CurrentUserContext';

// Simple page component
const NotFoundPage = () => <div className="container py-4"><h1>404 - Not Found</h1></div>;


function App() {
  return (
    <Router>
      <CurrentUserProvider>
        <div className="d-flex flex-column min-vh-100">
          <NavBar />
            <main className="flex-grow-1 " style={{ paddingTop: "70px" }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignInForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/create" element={<EventCreatePage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/events/:id/edit" element={<EventEditPage />} />
                <Route path="/events/:id/attendees" element={<EventAttendeesPage />} />
                {/* These routes all use the same EventsPage component but with different filters */}
                <Route path="/myevents" element={<EventsPage />} />
                <Route path="/attending" element={<EventsPage />} />
                <Route path="/favorites" element={<EventsPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/profile/:username/edit" element={<ProfileEditForm />} />
                <Route path="/people" element={<PeoplePage />} />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          <Footer />
        </div>
      </CurrentUserProvider>
    </Router>

  );
}

export default App;
