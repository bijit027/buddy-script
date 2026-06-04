# BuddyScript – Social Media Web App

A full-stack social media application built with React.js and Laravel.

## Tech Stack
- **Frontend:** React.js (Vite), React Router v6, React Query, Axios
- **Backend:** Laravel 11, Laravel Sanctum, MySQL
- **Auth:** Token-based authentication (Sanctum Bearer tokens)

## Features
- User registration and login with validation
- JWT-like token auth with 7-day expiry
- Create, view, and delete posts
- Like/unlike posts (optimistic UI)
- Comment on posts
- Dark mode toggle (persisted)
- Responsive design

## Live Demo
- Frontend: https://buddyscript.vercel.app
- Backend API: https://buddyscript-api.railway.app

## Demo Credentials
- Email: demo@buddyscript.com
- Password: Password123

## Setup (Local)

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure DB in .env
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000/api
npm run dev
```
