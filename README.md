# 🌙 Luna — Smart Period Tracker & Self-Care Companion

Luna is a modern, comprehensive, and beautiful web application designed to help individuals track their menstrual cycles, understand their hormonal rhythms, log daily journal entries with automatic mood tracking, and connect with a supportive community.

Built using **Vanilla Javascript (ES6 Modules)**, **Tailwind CSS**, and **Firebase (Auth & Firestore)**, Luna combines a premium user interface with robust, secure cloud synchronization.

---

## 🚀 Live Demo & Getting Started

Because Luna uses **ES6 JavaScript Modules** (`import`/`export`) and dynamically loads components (like the navigation bar via HTML `fetch`), **opening the `index.html` file directly in a browser via the `file://` protocol will fail** due to CORS security policies.

You must run Luna through a local web server. Below are the easiest ways to get started:

### Option 1: Using Python (Pre-installed on macOS/Linux)
Open your terminal in the project directory and run:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### Option 2: Using Node.js / npm
If you have Node.js installed, you can start a local server instantly without installing global packages:
```bash
npx serve
```
Then open the URL printed in your terminal (usually `http://localhost:3000` or `http://localhost:5000`).

### Option 3: VS Code "Live Server" Extension
1. Open the project folder in VS Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Click the **Go Live** button in the status bar at the bottom-right corner of VS Code.

---

## ✨ Key Features

### 📊 1. Smart Diagnostic Dashboard (`index.html`)
* **Cycle Calculation:** Enter your last period start date, average cycle length, and typical pain intensity to automatically compute your current cycle phase (**Menstrual, Follicular, Ovulation, Luteal**).
* **Personalized Daily Insights:** Dynamically updates suggestions tailored to your current phase:
  * **Energy Forecast:** Recommendations on activity level and rest.
  * **Pain & Discomfort:** Management tips for cramps and pain.
  * **Nutrition & Recovery:** Suggestions for hormone-supportive foods (e.g., magnesium, iron-rich meals, complex carbs).
* **Regulatory Trend Graph:** Integrates **Chart.js** to display a smooth, curved visualization of your cycle regularity over a 5-month timeline, highlighting any irregular cycle patterns.
* **Smart Navigation & Welcome:** Dynamically renders user greetings and updates authentication states.

### 📅 2. Interactive Calendar Sync (`calendar.html` / `calendar.js`)
* **Interactive Day Toggling:** Click any date on the calendar grid to instantly log/remove a period day.
* **Automatic Cloud Sync:** Period dates are immediately synchronized in real-time with Firebase Firestore.
* **Visual Identifiers:**
  * 🩸 **Purple Drop Icons:** Mark logged menstrual cycle days.
  * ⭐ **Pulsing Pink Stars:** Highlight predicted ovulation days (calculated dynamically at day `+13` from the cycle start).
  * 🎯 **Rings & Glows:** Highlights today's date so you never lose track.
* **Forced Cloud Sync:** A manual synchronization action that fetches the latest stored database entries.

### ✍️ 3. Private Self-Care Journal (`journal.html` / `journal.js`)
* **Secure Writing Space:** Log daily feelings, physical symptoms, and personal reflections safely tied to your user ID.
* **Real-time Word Counter:** Keep track of your entry lengths as you write.
* **Automatic Mood Analytics:** Behind-the-scenes keyword detection scans entries for signs of discomfort (e.g., *pain, cramps, hurt, stress, sad, tired, heavy, bloated*).
* **Smart Reminders & Badges:** Automatically marks entries with a `Positive` or `Discomfort` tag.
* **Self-Care "Comfort Zone" Modal:** If discomfort indicators are detected, the journal triggers a gentle, comforting modal prompt leading to self-care suggestions and relief resources (`comfort.html`).

### 💬 4. Live Support Circle Chat (`support.html`)
* **Safe Community Chat:** Anonymously and securely share experiences with other members of the Luna community.
* **Real-time Messaging:** Powered by Firestore `onSnapshot` listener to stream incoming messages instantly.
* **Dynamic Custom Avatars & Usernames:** Set a temporary guest display name or automatically pull your authenticated profile name.
* **Secure Anonymous Logins:** Leverages Firebase Anonymous Auth to allow chat participation while respecting user privacy.

### 📚 5. Education Hub & Cycle Guides (`education.html`)
* **Curated Knowledge Base:** High-quality, digestible guides answering common questions:
  * **Cycle Phases:** Deep-dive into what happens to hormones during each phase.
  * **Hygiene Products:** Information on pads, tampons, menstrual cups, and period underwear.
  * **Symptom Analytics:** A "Is This Normal?" handbook for period-related symptoms.
  * **PMS Support:** Coping mechanisms and lifestyle changes to combat pre-menstrual symptoms.

---

## 🛠️ Technology Stack

* **Frontend Structure & Logic:** HTML5, JavaScript (ES6 Modules, async/await, DOM APIs)
* **Styling & Theme:** Tailwind CSS (via CDN), FontAwesome (icons), Google Fonts (Nunito font)
* **Database & Auth:** Firebase Firestore, Firebase Authentication
* **Visualizations:** Chart.js (Responsive Canvas Line Charts)

---

## 📂 Project Structure

```
Luna-Period-Tracker-Web-App/
├── index.html            # Main dashboard, diagnostic form, and trend graph
├── calendar.html         # Interactive calendar logging interface
├── journal.html          # Private diary with mood analysis and logs list
├── education.html        # Resources index page
├── support.html          # Live anonymous community group chat room
├── login.html            # Firebase login / signup page
│
├── navbar.html           # Reusable navigation bar component template
├── loadNavbar.js         # Script to fetch and load navbar.html dynamically
│
├── calendar.js           # Calendar state, day togglers, and Firestore sync
├── journal.js            # Journal database connections and mood analysis engine
├── login.js              # Auth handlers, user signup/login, and session states
├── script.js             # Basic site-wide utilities
├── style.css             # Supplementary styling overrides and helper rules
├── firebaseConfig.js     # Shared Firebase setup and initialization module
│
├── guide-cycle.html      # Cycle phases deep-dive article
├── guide-normal.html     # Symptom normalities educational article
├── guide-pms.html        # Managing PMS symptoms educational article
├── guide-products.html   # Period product comparisons article
├── comfort.html          # Dynamic self-care relief/comfort zone recommendations page
│
├── logo.png              # App branding assets
├── luna.png              # App graphical assets
├── name.png              # Logo typography asset
└── README.md             # Project documentation (this file)
```

---

## 💾 Firestore Schema Structure

Luna stores and syncs user data in Firebase Firestore under structured collections:

### 1. Period Dates (`period_dates`)
Stored under: `artifacts/{appId}/users/{userId}/period_dates/{dateStr}`
```json
{
  "date": "2026-06-29",
  "year": 2026,
  "month": 6,
  "day": 29,
  "timestamp": "serverTimestamp()"
}
```

### 2. Journal Entries (`journal_entries`)
Stored under: `artifacts/{appId}/users/{userId}/journal_entries`
```json
{
  "title": "Evening reflection",
  "content": "Feeling a bit tired today but had some warm chamomile tea.",
  "timestamp": "serverTimestamp()",
  "wordCount": 11,
  "moodAnalysis": "Discomfort"
}
```

### 3. Community Messages (`messages`)
Stored under: `messages/{messageId}`
```json
{
  "text": "Hello everyone! Happy to join the circle.",
  "createdAt": "serverTimestamp()",
  "uid": "anonymousUserId",
  "username": "Riya"
}
```

---

## 🎨 Design System

Luna's aesthetic is designed to feel warm, calming, and clean:
* **Primary Palette:** Lavender (`#faf5ff`), Purple (`#a855f7`), and Fuchsia (`#d946ef`).
* **Visual Effects:** Soft glassmorphism backdrop blur styles (`backdrop-filter: blur(10px)`) combined with subtle border strokes.
* **Typography:** Rounded Nunito font to emphasize friendly, stress-free usability.

---

© 2026 Luna Healthcare. Empowering individuals through data and self-care.
