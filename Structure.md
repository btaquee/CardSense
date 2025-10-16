# Project Structure

This project use React(frontend) and Django(backend). 

Writen by me.

## Project Structure

The project structure as follows:

```
CS180GROUP_PROJECT/
├─ accounts/              # Django APP: auth & user endpoints (example app)
│  ├─ migrations/         # DB schema changes for this app
│  ├─ admin.py            # Admin site config for app models
│  ├─ apps.py             # App config
│  ├─ models.py           # Database models for accounts
│  ├─ views.py            # Request handlers (return JSON)
│  ├─ urls.py             # Routes for this app (e.g., /api/accounts/health/)
│  └─ tests.py            # Unit tests for this app
│
├─ api/                   # Django PROJECT (global config/container)
│  ├─ settings.py         # Installed apps, DB, CORS, REST, static/media paths
│  ├─ urls.py             # Root URL router (includes app URLs under /api/…)
│  ├─ asgi.py / wsgi.py   # Server entrypoints
│  └─ __init__.py
│
├─ web/                   # React web app (the UI)
│  ├─ public/             # Static assets served as-is (index.html, icons)
│  ├─ src/                # React source (components, pages, api client)
│  ├─ .env.development    # Frontend env vars (e.g., API base URL)
│  ├─ package.json        # Frontend deps & scripts
│  └─ README.md
│
├─ venv/                  # Python virtual environment (local only; not shared)
├─ db.sqlite3             # Dev database (local)
├─ manage.py              # Django CLI helper (runserver, migrate, etc.)
├─ README.md              # Project overview & quickstart
└─ Structure.md           # This structure explanation / team notes

```

## Requirements

Install Dependencies for React and Django before go live!


**Run Django**

Django run under virtual environment, this is store under `vene/` folder. Activate it before run Django. 

Under CS180Group_Project: 
- Activate it: `.\venv\Scripts\Activate.ps1`
- Run: `python manage.py runserver`
It should go live: http://127.0.0.1:8000/, will display "Welcome to the Home Page!"

**Run React**

cd to `web/` folder.
Run: `npm start`
It should go live: http://localhost:3000, will display "Edit src/App.js and save to reload."



Health check: http://127.0.0.1:8000/api/accounts/health/ (check if website run ok)