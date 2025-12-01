# CardSense
*CS180 Group Project*

**Manage user's budgets and maximize credit card rewards by tracking spending**


**Authors**

[![Static Badge](https://img.shields.io/badge/Xiyuan%20Wu-path?style=for-the-badge&color=%2387CEEB)](https://github.com/XiyuanWu)
[![Static Badge](https://img.shields.io/badge/Andrew%20Do-path?style=for-the-badge&color=%2390EE90)](https://github.com/androodo)
[![Static Badge](https://img.shields.io/badge/Brandon%20nguyan-path?style=for-the-badge&color=%23CBC3E3)]()
[![Static Badge](https://img.shields.io/badge/Burhanuddin%20Taquee-path?style=for-the-badge&color=%23FFFF00)]()


## Introduction

Many Americans face numerous financial challenges under certain circumstances, particularly during the pandemic. A large group of cardholders can’t pay their credit card bill in one, resulting in them paying high interest fees. On the other hand, many cardholders may or may not be able to pay their bill in one, but those who use only a single or a very few number of cards miss out on potential rewards that would have been earned by using more suitable cards for specific categories, such as groceries, gas, and dining. Our web app addresses both problems separately and together: a budget tracker to reduce interest costs, and a card-rewards optimizer to help users earn more on ordinary spending.

## Overview

<!-- <img src="./img/CardSense%20Overview.png" alt="CardSense Overview" width="500"> -->




## Installation/Usage

To run this project on your local PC:

### Prerequisites
- Python 3.x
- Node.js and npm
- Git

### Clone the Repository
```
git clone https://github.com/btaquee/CardSense.git
```

### Install dependencies

**Django**

*Note that Django need run under virtual environment!*

```py
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1      # Windows
source venv/bin/activate         # macOS/Linux

# Install Django and API dependencies
pip install Django
pip install djangorestframework django
pip install django-cors-headers
```
**React**

```
# Switch to `web` folder
cd web

# Install React dependencies
npm install
```

### Running the Program

In order to run the website, you need **TWO terminal windows** running simultaneously:

1. First running frontend:
```bush
npm start
```
Website should live on http://localhost:3000/.

2. Open a new terminal, now run backend:

use `cd ..` swtich to `Cardsense/` folder, then run backend
```bush
python manage.py runserver
```

**Important Notes**

Common Mistake: Make sure you run commands from the correct directory:
- Django commands: Run from `CardSense/` (project root)
- React commands: Run from `CardSense/web/` (web folder)

## Project Structure

Primarily for developers' purposes, but if you want to know the structure of this project and the skill set. 

```py
CardSense/
│
├─ api/                   # Django PROJECT (global config/container)
│
├─ accounts/              # Django APP: authentication & user management
├─ transactions/          # Django APP: user transactions (manual/CSV), CRUD, signals
├─ budgets/               # Django APP: single monthly budget per user + alert thresholds/events
├─ cards/                 # Django APP: card products and reward rules
├─ optimizer/             # Django APP: best-card recommendation engine (service endpoints)
│
├─ web/                   # React web app (the UI)
│
├─ venv/                  # Python virtual environment (local only; not shared)
├─ db.sqlite3             # Dev database (local)
├─ manage.py              # Django CLI helper (runserver, migrate, etc.)
└─ README.md              # Project overview & quickstart
```

## Other Resource

Primarily for developers' purposes, but it contains many helpful resources that help you understand this project more, or even build on it.

For the complete, detailed class diagram with all attributes and methods, see [`diagrams`](./diagrams/).