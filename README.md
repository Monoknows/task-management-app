Task Manager App

A full stack management app with user auth, dashboard, task CRUD, and per account appearance settings(accent color and profile picture).

Frontend - React + Vite
Backend - FastAPI + SQLAlchemy + SQLite

Project Strucute:

TASK-MANAGEMENT-APP/
├── backend/
│ ├── database.py  
│ ├── main.py  
│ ├── models.py  
│ ├── schemas.py  
│ ├── requirements.txt  
│ └── test.db  
│
└── frontend/
├── public/
├── src/
│ ├── components/
│ │ ├── Auth/Auth.jsx
│ │ ├── DashboardOverview/DashboardOverview.jsx
│ │ ├── SettingsView/SettingsView.jsx
│ │ ├── Sidebar/Sidebar.jsx
│ │ ├── TaskCard/TaskCard.jsx
│ │ ├── TaskDetail/TaskDetail.jsx
│ │ ├── TaskHeader/TaskHeader.jsx
│ │ └── TaskModal/TaskModal.jsx
│ ├── App.jsx  
 │ ├── index.css
│ └── main.jsx  
 ├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js

Prerequisites

Python 3.9+
Node.js 18+ and npm

Backend Setup

Navigate to the backend folder:

bash cd backend

(Recommended) Create and activate a virtual environment:

bash python -m venv venv

# macOS / Linux

source venv/bin/activate

# Windows

venv\Scripts\activate

Install dependencies:

bash pip install -r requirements.txt

PackageWhy it's neededfastapiWeb framework / routinguvicorn[standard]ASGI server to run the FastAPI appsqlalchemyORM for the User/Task modelspydantic[email]Request/response validation; the [email] extra is required because schemas use EmailStr

Run the server:

bash uvicorn main:app --reload

The API will be available at http://127.0.0.1:8000.
Interactive API docs are auto-generated at http://127.0.0.1:8000/docs.

On first run, test.db is created automatically with all required tables —
no manual migration step needed.

Note: If you already had a test.db from before the accent_color /
avatar_url columns were added to the User model, delete test.db and
restart the server so it regenerates with the updated schema. This wipes
existing accounts and tasks.

Frontend Setup

Navigate to the frontend folder:

bash cd frontend

Install dependencies:

bash npm install

Key packages (see package.json for the full list):

PackageVersionWhy it's neededreact^19.2.7UI libraryreact-dom^19.2.7React rendering for the browservite^8.1.0Dev server & build tool@vitejs/plugin-react^6.0.2Vite's React plugin (JSX support, fast refresh)

react-router-dom is also listed in package.json but isn't currently
used — navigation between Dashboard / My Tasks / Settings is handled via
component state in App.jsx, not routes.

Run the dev server:

bash npm run dev

The app will be available at http://localhost: (Vite's default port).

The backend's CORS settings only allow requests from http://localhost:.
If your frontend runs on a different port, update allow_origins in
main.py to match.

Running the Full App

You need both servers running at the same time, in two separate terminals:

bash# Terminal 1 — backend
cd backend
uvicorn main:app --reload

# Terminal 2 — frontend

cd frontend
npm run dev

Then open the link that the terminal gave you in your browser.

Using the App

Sign up for an account (full name, email, password).
After sign-up succeeds, you'll be prompted to sign in.
From the sidebar, navigate between:

Dashboard — task stats, completion rate, recent activity
My Tasks — create, search, filter, edit, complete, and delete tasks
Settings — update your accent color, upload a profile picture, and change your password

Click Sign out (⎋ icon) in the sidebar to log out.

Notes on Data Persistence

Tasks and user accounts are stored in SQLite (test.db), so all data
persists across server restarts.
Profile pictures are stored as base64-encoded strings directly in the
database (capped at ~2MB) — there's no external file storage configured.
The logged-in session is kept in the browser's localStorage, so refreshing
the page keeps you signed in until you click sign out.
