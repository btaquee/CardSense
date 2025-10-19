# Quick Project Start Guide

## Project structure (what each thing is for)

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
├─ this project has more app here, follow same pattern
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

## How things connect

* **React (web)** calls the **Django API** via the base URL in `web/.env.development`:

  * `REACT_APP_API_URL=http://localhost:8000/api`
* **Django (api project)** exposes endpoints and groups them by **app**:

  * Root router: `api/urls.py`
  * App router: `accounts/urls.py` (included at `/api/accounts/…`)
* **CORS** in `api/settings.py` allows the React dev origin (`http://localhost:3000`) during development.

## Day-to-day workflow

**Start backend (Django)**

```
# from repo root
.\venv\Scripts\activate        # Windows
# or: source venv/bin/activate # macOS/Linux
python manage.py runserver
```

**Start frontend (React)**

```
cd web
npm start
```

**Check connectivity**

* Visit `http://localhost:8000/api/accounts/health/` → should return JSON.
* Open the browser console when `web` runs — API calls should succeed.

## Conventions we follow

* **API prefix**: all backend routes live under `/api/...` to avoid conflicts with the SPA router.
* **One concern per app**: create a new Django **app** per domain (e.g., `transactions`, `rewards`, `budget`).

  * Each app gets its own `models.py`, `views.py`, `urls.py`, and tests.
  * Add the app to `INSTALLED_APPS` in `api/settings.py`, then include its `urls.py` in `api/urls.py`.
* **Env vars**: never hard-code URLs/keys. Frontend uses `REACT_APP_*` in `.env.*` files.
* **Static vs media** (when needed):

  * Static (CSS/JS/images for Django admin/DRF UI) → `STATIC_*` in `settings.py`
  * Media (user uploads like CSVs) → `MEDIA_*` in `settings.py`

## Adding a new feature (example: “transactions”)

1. **Create app**

```
python manage.py startapp transactions
```

2. **Register app** in `api/settings.py` → `INSTALLED_APPS += ["transactions"]`
3. **Add routes**

   * `transactions/urls.py` (create this)
   * `api/urls.py` → `path("api/transactions/", include("transactions.urls"))`
4. **Implement** models/views/tests in the `transactions` app.
5. **Migrate** if you added models:

```
python manage.py makemigrations
python manage.py migrate
```

6. **Call from React** using `process.env.REACT_APP_API_URL`.

# Testing & quality

* **Backend tests** live in each app’s `tests.py` (or a `tests/` package). Run:
  `python manage.py test`
* **Frontend tests**: add as needed in `web/src` (Jest/RTL if you choose).
* **README.md**: keep the quickstart updated for new teammates.

That’s it — clean split: **web = UI**, **api = data**, **apps = features**. This makes parallel work easy and keeps the codebase understandable for everyone.

---

<div align="right">* Most Content written by AI.*</div> 