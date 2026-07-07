# Book Library

A mobile-first personal book library. Sign up, search Google Books to add titles (or add manually), track read/unread status, and leave a rating + review per book.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (class-based dark mode)
- React Router

## Requirements

This is the frontend only. Backend repo: [book-library-API](https://github.com/iremstalbrand/book-library-API)

It expects the API server running at `http://localhost:5002` with:

- `POST /auth/register`, `POST /auth/login`
- `GET /books`, `POST /books`, `DELETE /books/:id`
- `PATCH /books/:id/status` — toggles read/unread
- `GET /search?q=` (Google Books proxy)
- `POST /books/:id/reviews` — `{ rating: 1-5, comment }`, one review per book

## Getting started

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173` by default (Vite dev server). Make sure the backend is running on port 5002 first, or requests will fail.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Project structure

```
src/
  api/            fetch wrappers for the backend (auth, books)
  components/     BottomNav, ThemeToggle, ProtectedRoute
  hooks/          AuthContext, ThemeContext, ToastContext
  pages/          Login, Register, Books (library/add/profile + book detail)
```

- Auth token + user are kept in `localStorage` and restored on load via `AuthContext`.
- Theme preference is kept in `localStorage` and applied by toggling a `dark` class on `<html>`.
- Routes: `/login`, `/register`, `/books` (protected), `/` redirects to `/books` or `/login` depending on auth state.
