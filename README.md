# Food-Sharing-App
A platform where households, restaurants, and markets can post surplus food for pickup by community members or charities.

# Overview
This application supports 3 user roles (giver, receiver, admin) where givers post surplus food, receivers request or book pickups, and admins manage moderation and metrics.

**SMART Deliverables:**

* An app with auth, food posting, requests, and pickup confirmation.
* 3 roles + full CRUD + dashboard metrics (posts, fulfilled pickups, pending requests, active users).
* Simple MongoDB schemas, Cloudinary for images.
* Enabled redistribution of surplus food.

---

## Tech Stack

* **Frontend:** React (Vite or Create React App), React Router, Redux or Context + SWR/React Query for data fetching, Tailwind CSS for quick UI.
* **Backend:** Node.js + Express
* **Database:** MongoDB (Atlas recommended)
* **Auth:** JWT (access + optional refresh), bcrypt for password hashing
* **Images:** Cloudinary (store `secure_url` + `public_id`)
* **Testing:** Jest + Supertest (backend), React Testing Library + vitest/jest (frontend), Cypress for E2E
* **Hosting / CI:** Vercel (frontend), Render/Heroku/DigitalOcean App (backend), GitHub Actions

---

## High-level Features

1. User auth (signup / login) with roles: `giver`, `receiver`, `admin`.
2. Giver: create/edit/delete food posts with images, location, pickup window, quantity, categories, pickup instructions.
3. Receiver: browse posts, request/claim a pickup, message/contact the giver, mark as picked up.
4. Admin: moderate posts (approve/reject), manage users, view dashboard metrics and export reports.
5. Notifications: email (optional) + in-app notifications for requests and confirmations.
6. Search & filter: by location, category, distance, availability.
7. Dashboard metrics: posts created, pickups completed, active users, top givers/receivers.
8. Safety & privacy: hide contact until approved, rate limiting, reporting posts.

---

## Project Structure 

```
foodshare/
├─ client/                # React app
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ services/        # API wrappers
│  │  ├─ context/ or store/
│  │  ├─ hooks/
│  │  └─ App.jsx
├─ server/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ middlewares/
│  │  ├─ utils/      
│  │  └─ services/          # cloudinary, email
├─ app.js              
├─ server.js     
└─ README.md
```

---

## API Endpoints (Express)

### Auth

* `POST /api/auth/register` — signup (role param allowed but only admin can set admin role)
* `POST /api/auth/login` — returns JWT
* `GET /api/auth/me` — user profile

### Users (admin-protected)

* `GET /api/users` — list/paginate
* `PUT /api/users/:id` — update
* `DELETE /api/users/:id` — delete

### Food Posts

* `POST /api/posts` — create (multipart/form-data or send image URLs). Giver role.
* `GET /api/posts` — list, with query params: ?near=lng,lat&radius=km&category=&status=
* `GET /api/posts/:id` — single post
* `PUT /api/posts/:id` — update (owner or admin)
* `DELETE /api/posts/:id` — remove
* `POST /api/posts/:id/expire` — mark expired (cron job can auto-expire)

### Requests / Reservations

* `POST /api/posts/:id/requests` — create request for a post (receiver)
* `GET /api/requests` — user requests (or admin)
* `PUT /api/requests/:id` — accept/reject/cancel/mark collected (giver or admin)

### Admin Metrics

* `GET /api/admin/metrics` — counts for dashboard

---

## Auth & Middleware

* JWT access token (expires short, e.g., 15m) and refresh tokens.
* `authMiddleware` validates token and attaches `req.user`.
* `roleMiddleware(['giver','admin'])` checks role.
* Sanitize inputs; use helmet, rate-limit, cors.

---

## Cloudinary Integration

* Use `cloudinary` npm package and upload images server-side.
* Store returned `secure_url` and `public_id` in the FoodPost `images` array.
* On delete, call `cloudinary.uploader.destroy(public_id)` to remove.

**Env vars**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

---

## Frontend (React) — Key Pages & Components

* Public: Home, Browse posts, Post details, Login/Register
* Authenticated Giver: Create Post, My Posts, Requests for My Posts
* Authenticated Receiver: My Requests, Saved Posts, Profile
* Admin: Admin Dashboard (metrics + moderation)

**Important components**

* `PostCard` (list item)
* `PostForm` (create/edit)
* `MapSearch` (geolocation/nearby)
* `RequestModal` (make a pickup request)
* `DashboardMetrics` (charts)

**Services**: `api.js` wrapper with axios; attach JWT header.

---

## UX & Flow Notes

* Photo + short description + pickup window.
* Allow claims rather than first-come — keep reservation flow simple: receiver sends request; giver accepts; receiver collects and giver marks collected.
* Optionally integrate SMS or email confirmation for pickups.
* Provide quick links for charities to bulk claim or view expired-but-still-edible.

---

## Testing Plan

* Backend: unit tests for controllers & services, integration tests using `mongodb-memory-server` + Supertest.
* Frontend: component tests for forms & pages (React Testing Library), e2e tests with Cypress to simulate create -> claim -> collect flows.
* CI: run tests on GitHub Actions on push/PR.

---

## Security & Privacy

* Hash passwords with bcrypt (saltRounds >= 10).
* Validate and sanitize all input (express-validator or Joi).
* Limit exposure of phone/email — only revealed to confirmed receivers or after admin approval.
* Use HTTPS in production. Keep JWT secret and Cloudinary creds in env.

---

## Deployment

* **Frontend:** Vercel or Netlify. Build env: `REACT_APP_API_URL`.
* **Backend:** Render, Heroku, Railway or DigitalOcean App. Connect to MongoDB Atlas.
* **Database:** MongoDB Atlas, backup enabled.
* **Storage:** Cloudinary for images.

---

## Acceptance Criteria (done when)

* Users can register/login and have roles.
* Givers can post with images and location.
* Receivers can request and see status; givers can accept and mark collected.
* Admin can moderate posts and view dashboard metrics.
* Images are stored in Cloudinary and cleaned up when deleted.
* Tests exist for main backend flows and run on CI.

---

## Code Snippets

**Express auth — register & login**

```js
// utils/generateToken.js
const jwt = require('jsonwebtoken');
module.exports = function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
}
```

**Cloudinary service (server/services/cloudinary.js)**

```js
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
module.exports = cloudinary;
```

**Sample POST /api/posts controller flow**

* Validate body; handle file(s) upload to Cloudinary; create FoodPost doc with returned urls; respond with created doc.

---

## Monitoring & Metrics

* Expose `GET /api/admin/metrics` which returns counts: totalPosts, availablePosts, reserved, pickedUp, usersByRole.
* Optionally add Sentry for error tracking.

---

