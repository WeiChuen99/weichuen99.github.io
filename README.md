# Family Fuel Tracker

A modern, user-friendly web application to track fuel refills across multiple family cars with weekly budget monitoring and analytics.

## Features

- **Quick Fuel Entry**: Easy-to-use form for logging refills with auto-calculated totals
- **Weekly Budget Tracking**: Real-time progress bar with visual indicators (green/yellow/red)
- **Multi-Car Support**: Track 6 cars (X, C, Mv, P, M, RR) with individual statistics
- **Multi-User Support**: Track which family member refueled (C, Z, S, M, P)
- **Dashboard Analytics**: View weekly spending, per-car stats, and refill history
- **History & Filtering**: Searchable history table with car and user filters
- **Real-time Sync**: Firebase Firestore for cross-device data synchronization
- **Responsive Design**: Mobile-first design optimized for on-the-go use

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom design system
- **Database**: Firebase Firestore
- **Charts**: Recharts (ready to implement)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database in your Firebase project
3. Get your Firebase configuration from Project Settings
4. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

5. Fill in your Firebase credentials in `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Security Rules

Set up the following security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /fuelEntries/{entry} {
      allow read, write: if true;
    }
    match /settings/{setting} {
      allow read, write: if true;
    }
  }
}
```

**Note**: These rules allow public access. For production, implement proper authentication.

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Configuration

### Cars
Edit `src/lib/constants.ts` to customize car names, colors, and icons:
- X (Blue) 🚗
- C (Red) 🚙
- Mv (Green) 🚐
- P (Orange) 🚕
- M (Purple) 🚘
- RR (Pink) 🏎️

### Users
Current users: C, Z, S, M, P

### Weekly Budget
Default: RM120 (configurable in Firebase settings collection)

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Deployment

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── FuelEntryForm.tsx # Fuel entry form
│   ├── WeeklyBudget.tsx # Budget tracking widget
│   ├── CarCard.tsx      # Individual car statistics
│   └── HistoryTable.tsx # Refuel history table
├── hooks/
│   ├── useFuelEntries.ts # Firebase fuel entries hook
│   └── useSettings.ts    # Firebase settings hook
├── lib/
│   ├── firebase.ts      # Firebase configuration
│   ├── constants.ts     # App constants (cars, users)
│   ├── calculations.ts  # Budget and stats calculations
│   └── utils.ts         # Utility functions
├── types/
│   └── index.ts         # TypeScript type definitions
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

## Usage

### Adding a Fuel Entry

1. Click "Add Refuel" tab
2. Select car and user
3. Enter date, liters, and price per liter
4. Total cost is calculated automatically
5. Optionally add odometer, location, and notes
6. Click "Add Entry"

### Viewing Dashboard

- See current week's spending vs budget
- View progress bar with color indicators
- Check individual car statistics
- See last refill date for each car

### Viewing History

- Filter by car or user
- View all refuel entries in a table
- Delete entries if needed

## License

MIT
