import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component imports
import NavBar from './components/common/NavBar';

import SignInForm from './pages/auth/SignInForm';
import SignUpForm from './pages/auth/SignUpForm';
import ProfilePage from './pages/ProfilePage';
import PeoplePage from './pages/PeoplePage';

import Footer from './components/common/Footer';
//context provider
import { CurrentUserProvider } from './contexts/CurrentUserContext';

// Page imports placeholders
const HomePage = () => <div className="container py-4"><h1>Home Page</h1></div>;
const EventsPage = () => <div className="container py-4"><h1>Events Page</h1></div>;
const FavouritesPage = () => <div className="container py-4"><h1>Favourites Page</h1></div>;
const EventCreatePage = () => <div className="container py-4"><h1>Create Event Page</h1></div>;
const EventDetailPage = () => <div className="container py-4"><h1>Event Detail Page</h1></div>;
// ProfilePage component has been imported
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
                <Route path="/profile/:username" element={<ProfilePage />} />
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
