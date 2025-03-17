# Eventify - Events Feature

This directory contains components and pages for the Events feature of the Eventify application.

## Implementation Details

### Backend Changes

In the Django backend

1. **EventAttendee Model**: 
   - Tracks which users are attending which events
   - Ensures a user can only register once for an event

2. **API Endpoints**:
   - `/events/` - List all events or create a new event
   - `/events/{id}/` - Get, update, or delete a specific event
   - `/attendees/` - Register for events or list events a user is attending
   - `/attendees/{id}/` - View or cancel registration for an event
   - `/events/{id}/attendees/` - View all attendees for a specific event

### Frontend Components

1. **EventAttendButton**: Button for registering/unregistering for events
2. **EventCard**: Card component for displaying event summaries in lists
3. **EventDetail**: Component for viewing all details about an event
4. **EventForm**: Form for creating and editing events
5. **EventList**: Component for displaying and filtering events

### Pages

1. **EventsPage**: Main page for browsing events with filters
2. **EventDetailPage**: Page for viewing a single event with its details
3. **EventCreatePage**: Page for creating a new event
4. **EventEditPage**: Page for editing an existing event
5. **EventAttendeesPage**: Page for viewing all attendees of an event

### Key Features

1. **Event Management**:
   - Create, read, update, and delete events
   - Event categories for organization
   - Image uploads for event covers

2. **Event Registration**:
   - Register for events you want to attend
   - View the number of attendees for each event
   - Cancel registration if needed

3. **Event Favorites**:
   - Save events to your favorites list
   - Easily find them later

4. **Filtering and Search**:
   - Search for events by keywords
   - Filter by category

## Usage

### Events Page

The main events page shows all events by default. It can be filtered by:
- Using the search box to find events by keywords
- Selecting a category from the dropdown
- Using special URLs:
  - `/events` - All events
  - `/myevents` - Events created by the current user
  - `/attending` - Events the user is registered for
  - `/favorites` - Events the user has favorited

### Creating/Editing Events

1. Click "Create Event" on the events page (must be logged in)
2. Fill out the form with event details
3. Upload an image (optional)
4. Click "Create Event" to save

To edit an event you've created, click the edit button on the event card or event detail page.

### Event Registration

1. View an event's details by clicking on its card
2. Click "Register for Event" button
3. Your registration will be confirmed and the attendee count will increase
4. To cancel, click "Cancel Registration" button

## Implementation Notes

1. All forms include validation to ensure proper data entry
2. Unauthorized actions (like editing someone else's event) are prevented
3. Components are designed to be responsive for all screen sizes
4. CSS modules are used for styling to prevent conflicts

## Attendee
![alt text](attendees.png)

## Comments

![alt text](comments.png)

## Create, Search and Filter Events 

![alt text](FilterCreateSearch.png)

## Search Users 

![alt text](users.png)

## Profiles

![alt text](profile.png)