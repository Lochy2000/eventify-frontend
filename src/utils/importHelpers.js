// This file provides absolute path imports that will work reliably in both development and production
import SignInForm from 'pages/auth/SignInForm';
import SignUpForm from 'pages/auth/SignUpForm';
import EventsPage from 'pages/events/EventsPage';
import EventDetailPage from 'pages/events/EventDetailPage';
import EventCreatePage from 'pages/events/EventCreatePage';
import EventEditPage from 'pages/events/EventEditPage';
import EventAttendeesPage from 'pages/events/EventAttendeesPage';
import ProfilePage from 'pages/ProfilePage';
import ProfileEditForm from 'pages/ProfileEditForm';
import PeoplePage from 'pages/PeoplePage';
import HomePage from 'pages/HomePage';
import NavBar from 'components/common/NavBar';
import Footer from 'components/common/Footer';
import { CurrentUserProvider } from 'contexts/CurrentUserContext';

export {
  SignInForm,
  SignUpForm,
  EventsPage,
  EventDetailPage,
  EventCreatePage,
  EventEditPage,
  EventAttendeesPage,
  ProfilePage,
  ProfileEditForm,
  PeoplePage,
  HomePage,
  NavBar,
  Footer,
  CurrentUserProvider
};
