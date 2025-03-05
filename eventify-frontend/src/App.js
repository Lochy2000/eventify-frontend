import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component imports 
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Page imports placeholders
const HomePage = () => <div className="container py-4"><h1>Home Page</h1></div>;
const SignInPage = () => <div className="container py-4"><h1>Sign In Page</h1></div>;
const SignUpPage = () => <div className="container py-4"><h1>Sign Up Page</h1></div>;
const EventDetailPage = () => <div className="container py-4"><h1>Event Detail Page</h1></div>;
const ProfilePage = () => <div className="container py-4"><h1>Profile Page</h1></div>;
const NotFoundPage = () => <div className="container py-4"><h1>404 - Not Found</h1></div>;


function App() {
  return (
    <Router>
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </Router>
  );
}

export default App;
