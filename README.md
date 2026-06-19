Luna - Your Personal Cycle Guide

Luna is a comprehensive web application designed to help women track their menstrual cycles, understand their inner rhythms, and manage their health. It combines smart tracking features with educational resources and a private journal, all powered by secure cloud storage.

Features

1. Smart Cycle Tracking (index.html)
Dashboard: Visualizes your current cycle phase (Menstrual, Follicular, Ovulation, Luteal).
Predictions: Estimates your next period start date.
Insights: Provides personalized daily recommendations for:
Energy: What level of activity is best for you today.
Pain: Forecasts potential discomfort and management tips.
Nutrition: Suggests foods to support your hormonal phase.
Visual Graphs: Tracks cycle regularity over time.

2. Interactive Calendar (calendar.html)
Logging: Click any date to log period start/end dates instantly.
Synchronization: Dates logged on the dashboard sync automatically to the calendar.
Visual Cues:
Purple drops indicate logged period days.
Pink stars highlight predicted ovulation days.
Cloud syncing status indicators.

3. Private Journal (journal.html)
Secure Space: A private area to log daily thoughts, symptoms, and feelings.
Mood Analysis: Basic keyword detection checks for signs of distress (e.g., "pain", "sad") and offers a "Comfort Zone" prompt.
History: View past entries with timestamps and mood badges.

4. Education Hub (education.html)
Resource Library: Access guides on the menstrual cycle, hygiene products, symptom analysis ("Is this normal?"), and PMS management.
Smart Navigation: Context-aware navigation bar that shows login status.

5. User Authentication (login.html)
Secure Login/Signup: Powered by Firebase Authentication.
Persistent Sessions: Keeps you logged in across pages.
Private Data: Ensures your data is stored securely under your unique user ID.


Technology Stack

Frontend:

HTML5
JavaScript (ES6 Modules)
Tailwind CSS (via CDN for styling)
Chart.js (for visualization)
Canva (for icons and fonts)

Backend / Cloud:

Firebase Authentication: For user management.
Firebase Firestore: NoSQL database for storing user data (journals, cycle dates).

Project Structure

/
├── index.html          # Main Dashboard & Cycle Tracker
├── calendar.html       # Monthly View & Logging
├── journal.html        # Private Diary & History
├── education.html      # Educational Resources
├── login.html          # Authentication Page
├── home.js             # Logic for index.html (Cycle calcs & Graphs)
├── calendar.js         # Logic for calendar.html (Rendering & Syncing)
├── journal.js          # Logic for journal.html (Saving & Loading entries)
├── education.js        # Logic for education.html (Auth check)
├── login.js            # Logic for login.html (Auth handlers)
├── navbar.js           # Reusable Navbar Component
├── firebaseConfig.js   # Shared Firebase Configuration & Init
├── style.css           # Additional custom styles
└── README.md           # Project Documentation

This ensures that users can only access and modify their own data.

© 2026 Luna Healthcare. Empowering women through data.
