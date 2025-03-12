# Eventify - Event Management Platform (Frontend)

![Eventify Screenshot](image.png)

## Table of Contents
1. [Introduction](#introduction)
2. [Project Goals](#project-goals)
3. [UX Design](#ux-design)
   - [User Stories](#user-stories)
   - [Wireframes](#wireframes)
   - [Design Choices](#design-choices)
4. [Features](#features)
   - [Existing Features](#existing-features)
   - [Future Features](#future-features)
5. [Authentication System](#authentication-system)
6. [Profile & Social Features](#profile--social-features)
7. [Component Architecture](#component-architecture)
8. [Technologies Used](#technologies-used)
9. [Testing](#testing)
   - [Manual Testing](#manual-testing)
   - [Automated Testing](#automated-testing)
   - [Validation](#validation)
10. [Deployment](#deployment)
11. [Credits](#credits)
12. [Backend API](#backend-api)

## Introduction
Eventify is a full-stack event management platform that allows users to create, discover, and register for events. This repository contains the frontend React application that consumes the Eventify Django REST API.

The platform enables users to browse events, create their own events, register for events, and interact with other users through comments, follows, and a favorites system.

## Project Goals
The main goal of this project is to create a user-friendly event management platform where:
- Users can easily discover events based on various criteria
- Event creators can manage their events effectively
- The platform provides social interaction features
- The interface is intuitive and responsive across all devices

## UX Design
(This section will contain wireframes, mockups, and UX design documentation)

### User Stories
The project is built around addressing specific user needs, represented by the following user stories:

(User stories to be added here)

### Wireframes
(Wireframes to be added here)

### Design Choices
(Design choices to be added here)

## Features

### Existing Features
- User authentication (signup, login, logout)
- Event browsing with search and filtering
- Event creation and management
- Event registration
- User profiles
- Follow/unfollow functionality
- Favorites functionality
- Comments on events
- Responsive design

### Future Features
- Event categories and tags
- Event sharing to social media
- Advanced filtering and sorting options
- Email notifications
- Calendar integration

## Authentication System

Eventify implements a secure token-based authentication system leveraging Django's built-in authentication on the backend with a custom React implementation on the frontend.

### Authentication Flow

1. **User Registration (Sign Up)**
   - The registration process begins when a user submits the SignUpForm component
   - Form validation occurs on both client and server sides
   - The form data is sent to the Django backend's `/auth/registration/` endpoint
   - Upon successful registration, the user is redirected to the login page

2. **User Login**
   - Users enter their credentials in the SignInForm component
   - The credentials are validated and sent to the `/auth/login/` endpoint
   - Upon successful authentication, the server returns an authentication token
   - The token is stored in localStorage along with basic user information
   - The CurrentUserContext is updated to reflect the logged-in state

3. **Authentication State Management**
   - The application uses React's Context API to manage authentication state
   - The CurrentUserContext provides the current user's information to all components
   - Components can access the current user and authentication status using the useCurrentUser hook
   - Protected routes check this context to determine if a user can access certain pages

4. **Logout**
   - When a user logs out, the token is removed from localStorage
   - The user context is cleared
   - The server is notified via the `/auth/logout/` endpoint
   - The user is redirected to the home page

### Security Considerations

- Passwords are never stored in the frontend
- Authentication tokens are stored in localStorage
- Sensitive routes are protected on both client and server sides
- All API requests that require authentication include the token in the header

## Profile & Social Features

Eventify includes robust user profiles and social interaction features, enabling users to connect and follow each other.

### User Profiles

User profiles in Eventify provide a centralized place for users to:

1. **Display Personal Information**
   - Customizable profile picture (avatar)
   - User bio and location
   - Username and registration date

2. **Track Activity**
   - Events created by the user
   - Events the user is attending
   - Events the user has favorited

3. **Manage Social Connections**
   - View followers (people following this user)
   - View following (people this user follows)

The profile system is built with components that fetch data from the Django REST API's `/profiles/` endpoints and render the information in a user-friendly format.

### Follow System

The follow system allows users to connect with each other and stay updated on their activities:

1. **Follow Functionality**
   - Users can follow other users by clicking the "Follow" button on profiles
   - Following creates a relationship in the database through the `/followers/` API endpoint
   - The follow button toggles between "Follow" and "Following" states based on the relationship status

2. **Follower/Following Counts**
   - Each profile displays accurate counts of followers and following
   - The ProfileSerializer in the backend correctly calculates:
     - Followers: People who follow this profile (calculated using `Follower.objects.filter(followed=user)`)
     - Following: People whom this profile follows (calculated using `Follower.objects.filter(owner=user)`)

3. **Implementation Details**
   - The follow relationship is stored in a Follower model with owner and followed fields
   - Follow/unfollow actions trigger immediate UI updates for better user experience
   - Follow relationships power the social aspects of the platform, such as activity feeds

4. **Technical Considerations**
   - Follow actions are only available to authenticated users
   - Users cannot follow themselves (validated on both client and server sides)
   - The ProfilePage component fetches and displays follow relationships
   - The PeoplePage component allows discovering and following other users

### People Page

The platform includes a dedicated People page that:

1. **Displays User Profiles**
   - Shows all users except the currently logged-in user
   - Presents basic profile information in card format

2. **Provides Search Functionality**
   - Users can search for others by username, display name, or location
   - Search is performed client-side for instant results

3. **Enables Social Interaction**
   - Follow/unfollow buttons on each profile card
   - Links to full profile pages

## Component Architecture
Eventify's frontend is built using a component-based architecture with the following structure:

```
eventify-frontend/
│── public/                         
│   ├── index.html                   
│   ├── favicon.ico                  
│   └── images/                      
│
│── src/                            
│   ├── components/                  
│   │   ├── auth/                    
│   │   │   ├── SignInForm.js         
│   │   │   └── SignUpForm.js         
│   │   ├── events/                  
│   │   │   ├── EventCard.js          
│   │   │   ├── EventList.js          
│   │   │   ├── EventForm.js          
│   │   │   ├── EventDetail.js        
│   │   │   ├── EventFilter.js        
│   │   │   └── LikeButton.js         
│   │   ├── comments/                 
│   │   │   ├── Comment.js            
│   │   │   ├── CommentList.js        
│   │   │   └── CommentForm.js        
│   │   ├── favorites/               
│   │   │   ├── FavoriteButton.js     
│   │   │   └── FavoritesList.js      
│   │   ├── profiles/                 
│   │   │   ├── Profile.js            
│   │   │   └── ProfileCard.js        
│   │   └── common/                  
│   │       ├── NavBar.js             
│   │       ├── Footer.js             
│   │       └── Loading.js            
│   ├── pages/                      
│   │   ├── HomePage.js               
│   │   ├── EventDetailPage.js        
│   │   ├── EventCreatePage.js        
│   │   ├── EventEditPage.js          
│   │   ├── ProfilePage.js            
│   │   ├── PeoplePage.js             
│   │   └── NotFoundPage.js           
│   │
│   ├── contexts/                    
│   │   └── CurrentUserContext.js    
│   │
│   ├── hooks/                       
│   │   └── useRedirect.js            
│   │
│   ├── api/                    
│   │   └── axiosDefaults.js         
│   │
│   ├── styles/                      
│   │   ├── AuthForms.module.css      
│   │   ├── NavBar.module.css         
│   │   ├── Profile.module.css        
│   │   ├── ProfileCard.module.css    
│   │   └── ProfilePage.module.css    
│   │
│   ├── utils/                       
│   │   └── utils.js                  
│   │
│   ├── App.js                       
│   └── index.js                   
│
├── .env                             
├── .gitignore                       
├── package.json                     
└── README.md                        
```

## Technologies Used

### Languages
- HTML5
- CSS3
- JavaScript (ES6+)

### Frameworks & Libraries
- React.js
- React Router (`npm install react-router-dom`)
- React Bootstrap (`npm install bootstrap react-bootstrap`)
- Axios (`npm install axios`)
- JWT Decode (`npm install jwt-decode`)
- Optional utilities:
  - Formik & Yup (`npm install formik yup`) - For form handling and validation
  - date-fns (`npm install date-fns`) - For date formatting

### Development Tools
- Git & GitHub
- npm
- ESLint
- Prettier

## Testing

### Manual Testing
(Manual testing procedures and results to be added here)

### Automated Testing
(Automated testing information to be added here)

### Validation
(Validation details to be added here)

## Deployment
This section details the steps needed to deploy the Eventify frontend.

### Prerequisites
- Node.js (v16+)
- npm

### Local Deployment
1. Clone this repository:
   ```
   git clone https://github.com/your-username/eventify-frontend.git
   ```
2. Navigate to the project directory:
   ```
   cd eventify-frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```
5. Start the development server:
   ```
   npm start
   ```
6. The application should now be running on http://localhost:3000

### Production Deployment
(Production deployment instructions to be added here)

## Credits
(Credits and acknowledgments to be added here)

## Backend API
The frontend application consumes data from the Eventify Django REST API. For more information about the backend, please visit the backend repository.
https://github.com/Lochy2000/eventify-django 
