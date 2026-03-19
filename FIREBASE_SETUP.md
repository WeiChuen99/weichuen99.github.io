# Firebase Setup Guide

Follow these steps to set up Firebase for your Family Fuel Tracker application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "family-fuel-tracker")
4. Click "Continue"
5. Disable Google Analytics (optional, not needed for this app)
6. Click "Create project"
7. Wait for the project to be created, then click "Continue"

## Step 2: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Fuel Tracker Web")
3. **Do NOT** check "Also set up Firebase Hosting" (we'll use Netlify/Vercel)
4. Click "Register app"
5. You'll see your Firebase configuration - **keep this page open**

## Step 3: Enable Firestore Database

1. In the left sidebar, click "Build" → "Firestore Database"
2. Click "Create database"
3. Select "Start in **test mode**" (we'll secure it later)
4. Choose a Firestore location (select closest to your region)
5. Click "Enable"
6. Wait for the database to be created

## Step 4: Set Up Security Rules

1. In Firestore Database, click the "Rules" tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Legacy (single-car) entries
    match /fuelEntries/{entry} {
      allow read, write: if true;
    }

    // New (2-car) refuel receipt entries
    match /refuelReceipts/{receipt} {
      allow read, write: if true;
    }
    
    // Allow read/write access to settings
    match /settings/{setting} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"

**⚠️ Important**: These rules allow anyone to read/write your data. This is fine for a private family app, but for production with public access, you should implement Firebase Authentication.

## Step 5: Get Your Firebase Configuration

From the Firebase Console:

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. You'll see your Firebase configuration object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 6: Configure Your Local Environment

1. In your project root, create a `.env` file:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Or manually create the file
```

2. Open `.env` and fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

3. Save the file

## Step 7: Restart the Development Server

If the dev server is running, stop it (Ctrl+C) and restart:

```bash
npm run dev
```

The app should now connect to Firebase successfully!

## Step 8: Test the Application

1. Open http://localhost:5173 in your browser
2. Click "Add Refuel" tab
3. Fill in the form and submit
4. Go back to "Dashboard" - you should see your entry
5. Check Firebase Console → Firestore Database - you should see the data

## Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid)"
- Check that your API key in `.env` is correct
- Make sure there are no extra spaces or quotes

### Error: "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you published the rules

### Data not showing up
- Check browser console for errors (F12)
- Verify Firebase configuration is correct
- Make sure Firestore is enabled in Firebase Console

### App shows "Loading..." forever
- Check that all environment variables are set correctly
- Restart the dev server after changing `.env`
- Check browser console for errors

## Production Deployment

When deploying to Netlify/Vercel:

1. Add the same environment variables in your hosting platform's dashboard
2. Make sure to prefix them with `VITE_`
3. Redeploy the application

## Step 9: Enable Firebase Authentication (Required)

This app now requires user authentication to access the fuel tracker.

1. In Firebase Console, go to "Build" → "Authentication"
2. Click "Get started"
3. Click on "Email/Password" under "Sign-in method"
4. Enable "Email/Password" (toggle the switch)
5. Click "Save"

## Step 10: Update Firestore Security Rules (Required)

Now that authentication is enabled, you must update the security rules to require authentication:

1. In Firestore Database, click the "Rules" tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Legacy (single-car) entries - require authentication
    match /fuelEntries/{entry} {
      allow read, write: if request.auth != null;
    }

    // New (2-car) refuel receipt entries - require authentication
    match /refuelReceipts/{receipt} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Settings - require authentication
    match /settings/{setting} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

**Important**: These rules now require users to be authenticated. All family members will need to create an account to access the app.

## Step 11: Create User Accounts in Firebase Console

Users cannot sign up through the app. You must create accounts in Firebase Console:

1. In Firebase Console, go to "Build" → "Authentication"
2. Click on the "Users" tab
3. Click "Add user" button
4. Enter the user's email address
5. Enter a password (minimum 6 characters)
6. Click "Add user"
7. Repeat for each family member who needs access
8. Share the login credentials with each user securely

## Authentication Features

The app now includes:

- **Login Only**: Users sign in with credentials created by the administrator in Firebase Console
- **No Public Sign-Up**: Unauthorized users cannot create accounts through the app
- **Logout**: Sign out from the app (button in header)
- **Shared Family Data**: All authenticated users see the same fuel entries
- **Creator Tracking**: Each entry shows who created it in the History table
- **Persistent Sessions**: Users stay logged in until they explicitly log out

## Managing Users

To add or remove users:

1. Go to Firebase Console → Authentication → Users
2. **Add user**: Click "Add user" and enter email/password
3. **Delete user**: Click the three dots (⋮) next to a user and select "Delete user"
4. **Reset password**: Click the three dots (⋮) and select "Reset password" to send a password reset email

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all Firebase configuration values
3. Ensure Firestore is enabled and rules are published
4. Check that `.env` file is in the project root
