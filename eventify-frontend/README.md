# Install React Router for navigation
npm install react-router-dom

# Install Bootstrap and React-Bootstrap for UI
npm install bootstrap react-bootstrap

# Install Axios for API calls
npm install axios

# Install JWT decode for authentication
npm install jwt-decode

# Install additional utilities (optional)
npm install formik yup  # For form handling and validation
npm install date-fns    # For date formatting

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
│   │   │   ├── ProfileHeader.js      
│   │   │   └── ProfileEvents.js      
│   │   └── common/                  
│   │       ├── Navbar.js             
│   │       ├── Footer.js             
│   │       ├── Spinner.js            
│   │       ├── Alert.js              
│   │       └── Avatar.js             
│   ├── pages/                      
│   │   ├── HomePage.js               
│   │   ├── EventDetailPage.js        
│   │   ├── EventCreatePage.js        
│   │   ├── EventEditPage.js          
│   │   ├── ProfilePage.js            
│   │   ├── SignInPage.js             
│   │   ├── SignUpPage.js             
│   │   └── NotFoundPage.js           
│   │
│   ├── contexts/                    # Context API files
│   │   ├── AuthContext.js            
│   │   ├── CurrentUserContext.js    
│   │   └── AlertContext.js           # For application alerts/messages
│   │
│   ├── hooks/                       
│   │   ├── useAuth.js                # Authentication hook
│   │   ├── useEvents.js              # Hook for event operations
│   │   ├── useComments.js            # Hook for comment operations
│   │   └── useFavorites.js           # Hook for favorite operations
│   │
│   ├── services(optional)/                    # API service files
│   │   ├── api.js                    # Main API configuration
│   │   ├── authService.js            # Authentication API calls
│   │   ├── eventService.js           # Event-related API calls
│   │   ├── commentService.js         # Comment-related API calls
│   │   ├── favoriteService.js        # Favorite-related API calls
│   │   └── profileService.js         # Profile-related API calls
│   │
│   ├── styles/                      # Styles
│   │   ├── App.css                   # Global styles
│   │   ├── bootstrap-custom.scss     # Custom Bootstrap overrides
│   │   └── variables.scss            # SCSS variables
│   │
│   ├── utils/                       # Utility functions
│   │   ├── helpers.js                # Helper functions
│   │   ├── formatters.js             # Date/time formatting
│   │   ├── validators.js             # Form validation helpers
│   │   └── constants.js              # App constants
│   │
│   ├── App.js                       
│   ├── index.js                   
│   └── routes.js                    
│
├── .env                             
├── .gitignore                       
├── package.json                     
└── README.md                        