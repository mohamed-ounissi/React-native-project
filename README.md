# ExpoStarter

ExpoStarter is my first React Native mobile app, built with Expo, TypeScript, and Expo Router.  
It focuses on clean structure, practical navigation, and core app fundamentals.

## Project Overview

This project is a dashboard-style app with a modular authentication flow and tab navigation.  
The current version includes routing and UI foundations, with API-based features planned next.

## Current Features

- Auth module with separate `login` and `register` screens
- Basic form validation for required fields
- File-based routing with Expo Router
- Bottom tab navigation with `Home` and `Profile` tabs
- Disconnect action with confirmation alert and route back to login
- Styled using React Native `StyleSheet` API

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router

## Folder Structure

- `app/(auth)` - authentication routes (`login`, `register`)
- `app/(tabs)` - main app tab routes
- `app/index.tsx` - app entry redirect to login

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

- Integrate a real public API for the main list screen
- Add loading and error states for data fetching
- Add item detail screen navigation
- Improve UX and form validation polish
