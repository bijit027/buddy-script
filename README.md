# BuddyScript – Social Media Web App

A full-stack social media application built with React.js and Laravel, designed for scalability and performance.

## 🚀 Live Demo
- **Frontend:** https://buddy-script-psi.vercel.app
- **Backend API:** https://buddyscript-api-production.up.railway.app

## 📋 Project Overview

BuddyScript is a social media platform that allows users to create posts, interact through likes and comments, and control post visibility. The application is built with modern web technologies and follows best practices for security, performance, and scalability.

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Routing:** React Router v6
- **State Management:** React Query (@tanstack/react-query)
- **HTTP Client:** Axios
- **Styling:** CSS Modules with custom design system
- **Build Tool:** Vite

### Backend
- **Framework:** Laravel 11
- **Authentication:** Laravel Sanctum (Token-based)
- **Database:** MySQL
- **API:** RESTful API
- **File Storage:** Local storage (public disk)

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Railway MySQL

## ✨ Features Implemented

### Authentication & Authorization
- **Secure Token-based Authentication:** Uses Laravel Sanctum Bearer tokens
- **Registration:** First name, last name, email, and password with validation
- **Login:** Email and password with rate limiting (5 attempts per minute)
- **Protected Routes:** Feed page accessible only to authenticated users
- **Token Management:** Automatic token handling in frontend
- **Security:** Password hashing, input sanitization, and CORS protection

### Feed Page
- **Protected Route:** Only accessible to logged-in users
- **Post Visibility:** All users can see public posts; private posts visible only to author
- **Chronological Order:** Posts displayed with newest first (infinite scroll)
- **Post Creation:** Support for text and image uploads
- **Like/Unlike System:** Optimistic UI updates for posts
- **Comments:** Add comments to posts with real-time updates
- **Replies:** Reply to comments with nested threading
- **Comment Likes:** Like/unlike comments and replies
- **Like History:** View who liked posts, comments, and replies
- **Private/Public Posts:** Toggle visibility for each post
- **Infinite Scroll:** Efficient pagination for large datasets

### User Experience
- **Dark Mode:** Toggle between light and dark themes (persisted in localStorage)
- **Responsive Design:** Mobile-friendly layout
- **Optimistic Updates:** Instant UI feedback for likes and comments
- **Loading States:** Proper loading indicators for better UX
- **Error Handling:** User-friendly error messages

## 🏗 Architecture & Design Decisions

### Scalability Considerations
- **Database Indexing:** Performance indexes on frequently queried columns
- **Pagination:** Server-side pagination to handle millions of posts
- **Rate Limiting:** API rate limiting to prevent abuse
- **Efficient Queries:** Eager loading to prevent N+1 queries
- **Image Storage:** Optimized image handling with validation

### Security Best Practices
- **Token-based Auth:** No session storage, stateless API
- **Input Validation:** Server-side validation for all inputs
- **SQL Injection Prevention:** Using Eloquent ORM with parameterized queries
- **XSS Protection:** Input sanitization with strip_tags()
- **CORS Configuration:** Proper CORS settings for cross-origin requests
- **Password Security:** Bcrypt hashing with minimum requirements

### Database Design
- **Users Table:** Stores user credentials and profile information
- **Posts Table:** Stores post content, images, and visibility settings
- **Comments Table:** Supports nested replies with parent_id
- **Likes Table:** Polymorphic relationship for posts and comments
- **Personal Access Tokens:** Sanctum token management
- **Performance Indexes:** Optimized for common query patterns

## 📦 Installation & Setup

### Prerequisites
- PHP 8.3+
- Composer
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=buddyscript
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Run seeders (optional)
php artisan db:seed

# Start development server
php artisan serve
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure API URL in .env
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🧪 Demo Credentials

- **Email:** demo@buddyscript.com
- **Password:** Password123

## 📁 Project Structure

```
buddyscript/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/     # API controllers
│   │   │   ├── Middleware/      # Custom middleware
│   │   │   └── Requests/        # Form request validation
│   │   ├── Models/              # Eloquent models
│   │   └── Services/            # Business logic layer
│   ├── config/                 # Configuration files
│   ├── database/
│   │   ├── migrations/         # Database migrations
│   │   └── seeders/           # Database seeders
│   ├── routes/
│   │   ├── api.php            # API routes
│   │   └── web.php            # Web routes
│   └── public/                # Public assets
└── frontend/
    ├── public/
    │   └── assets/
    │       └── css/           # CSS modules
    ├── src/
    │   ├── components/        # React components
    │   ├── context/           # React context providers
    │   ├── hooks/             # Custom React hooks
    │   ├── pages/             # Page components
    │   ├── services/          # API service layer
    │   └── utils/             # Utility functions
    └── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires auth)
- `GET /api/me` - Get current user (requires auth)

### Posts
- `GET /api/posts` - Get feed with pagination
- `POST /api/posts` - Create new post (requires auth)
- `PUT /api/posts/{id}` - Update post (requires auth)
- `DELETE /api/posts/{id}` - Delete post (requires auth)
- `POST /api/posts/{id}/like` - Toggle like (requires auth)
- `GET /api/posts/{id}/likes` - Get post likes (requires auth)
- `GET /api/posts/{id}/comments` - Get post comments (requires auth)
- `POST /api/posts/{id}/comments` - Add comment (requires auth)

### Comments
- `POST /api/comments/{id}/like` - Toggle comment like (requires auth)
- `POST /api/comments/{id}/reply` - Reply to comment (requires auth)
- `GET /api/comments/{id}/likes` - Get comment likes (requires auth)

### Profile
- `PUT /api/profile` - Update user profile (requires auth)

## 🚢 Deployment

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Configure environment variables
3. Deploy automatically on push to main branch

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure environment variables (VITE_API_URL)
3. Deploy automatically on push to main branch

## 📝 Environment Variables

### Backend (.env)
```
APP_NAME=BuddyScript
APP_ENV=production
APP_KEY=your-app-key
APP_DEBUG=false
APP_URL=https://buddyscript-api-production.up.railway.app

DB_CONNECTION=mysql
DB_HOST=railway-host
DB_PORT=3306
DB_DATABASE=railway-database
DB_USERNAME=railway-username
DB_PASSWORD=railway-password
```

### Frontend (.env)
```
VITE_API_URL=https://buddyscript-api-production.up.railway.app/api
```

## 🔒 Security Features

- **Token-based Authentication:** Stateless API with Sanctum tokens
- **Rate Limiting:** Prevents brute force attacks
- **Input Validation:** Server-side validation for all inputs
- **SQL Injection Prevention:** Eloquent ORM with parameterized queries
- **XSS Protection:** Input sanitization and output encoding
- **CORS Protection:** Configured for allowed origins only
- **Password Requirements:** Minimum 8 characters, 1 uppercase, 1 number

## 📊 Performance Optimizations

- **Database Indexing:** Optimized for common query patterns
- **Eager Loading:** Prevents N+1 query problems
- **Pagination:** Server-side pagination for large datasets
- **Image Optimization:** File size limits and type validation
- **Caching:** React Query caching for API responses
- **Code Splitting:** Vite automatic code splitting

## 🤝 Contributing

This project was built as part of an interview assessment. For contributions, please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for demonstration purposes.

## 👨‍💻 Developer Notes

- The application uses token-based authentication (Sanctum) instead of sessions for API-first architecture
- Private posts are only visible to the author; public posts are visible to all authenticated users
- The feed uses infinite scroll for efficient loading of large datasets
- All API responses are JSON-formatted for consistency
- The frontend uses optimistic updates for better user experience
