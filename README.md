# ExpoStarter

ExpoStarter is my first React Native mobile app, built with Expo, TypeScript, and Expo Router.  
It focuses on clean structure, practical navigation, and core app fundamentals.

## Project Overview

This project is a dashboard-style app with a modular authentication flow and tab navigation.  
The current version includes live TVMaze API integration, loading/error handling, and a detail view flow.
Auth does not use a backend yet; for learning and simplicity, user/session data is stored locally on the device.

## Current Features

- Auth module with separate `login` and `register` screens
- Form validation for required fields, email format, and password rules
- File-based routing with Expo Router
- Bottom tab navigation with `Home` and `Profile` tabs
- Disconnect action with confirmation alert and route back to login
- Home screen fetches paginated shows from TVMaze API (`/shows?page=n`)
- Loading states for initial load, pull-to-refresh, and infinite scroll fetches
- Error handling with retry actions for list and detail fetch failures
- Detail screen fetches and displays show information from TVMaze (`/shows/:id`)
- Toggle between card layout and 3-column poster grid layout
- Styled using React Native `StyleSheet` API

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router

## Folder Structure

- `app/(auth)` - authentication routes (`login`, `register`)
- `app/(tabs)` - main app tab routes
- `app/details/[id].tsx` - show detail route (dynamic id)
- `app/index.tsx` - app entry route resolver (auth/session-aware redirect)

## Current App Flow

- App starts at `/` and `app/index.tsx` resolves the route using `use-auth-session`
- Unauthenticated startup path: `/` -> `/(auth)/login`
- Authenticated startup path: `/` -> `/(tabs)` (fast path when local session exists)
- After login, user enters `/(tabs)` home list
- Home list loads TV shows from TVMaze with pagination
- Pull-to-refresh reloads from page 0; reaching the list end loads next page
- Tapping a show opens `app/details/[id].tsx` and fetches the show details
- Header actions allow layout toggle (cards/grid) and disconnect

## Running the Project

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npx expo start
```

3. Open on:

- Expo Go (Android/iOS)
- Android emulator
- iOS simulator

## Next Steps

- Add filters/search for shows (genre, language, title)
- Add lightweight caching to reduce repeated network calls
- Improve profile tab with real user settings/data
- Add tests for auth validation and API mapping helpers
