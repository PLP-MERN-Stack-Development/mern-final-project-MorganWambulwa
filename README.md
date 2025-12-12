# FoodShare - Zero Hunger Initiative

FoodShare is a comprehensive full-stack MERN application designed to fight food insecurity. By connecting restaurants, hotels and individuals with surplus food to the communities that need it most, we are leveraging technology to achieve the UN Sustainable Development Goal 2: Zero Hunger.

## Live Demo

- **Frontend Application:** [View Live App](https://foodshare-app-nine.vercel.app/)
- **Backend API:** [View API Health](https://foodshare-app-e99t.onrender.com)
- **Video Demonstration:** <video controls src="Recording 2025-12-12 165025.mp4" title="Foodshare Video Demo"></video>

> Note: The backend is hosted on a free tier service (Render). Please allow up to 30 seconds for the initial request to wake up the server.

---

## Key Features

### For Donors
- **Donation Management:** Post surplus food items with details like quantity, expiry date, and images.
- **Request Handling:** Approve or reject requests from verified receivers.
- **Impact Tracking:** View history of donations and completed deliveries.

### For Drivers
- **Delivery Dashboard:** View available pickups nearby.
- **Route Optimization:** Interactive maps (Leaflet) to visualize pickup and drop-off points.
- **Status Updates:** Real-time updates for "In Transit" and "Delivered" statuses.

### For Receivers
- **Smart Discovery:** Filter available food donations by type and location.
- **Request System:** Seamlessly request items needed for your community or family.

### Security & Performance
- **Role-Based Access Control (RBAC):** Distinct permissions for Donors, Receivers, and Drivers.
- **Secure Authentication:** JWT (JSON Web Tokens) with HttpOnly cookies.
- **Image Optimization:** Integrated with Multer for efficient file handling.

---

## Tech Stack

| Domain | Technologies |
| :--- | :--- |
| Frontend | React.js (Vite), Tailwind CSS, ShadCN UI, Lucide React, React Leaflet, Axios |
| Backend | Node.js, Express.js, RESTful API Architecture |
| Database | MongoDB Atlas, Mongoose ODM |
| Authentication | JWT, Bcrypt.js |
| Testing | Vitest, Supertest (Integration Testing) |
| DevOps | Render (Backend), Vercel (Frontend), Git |

---

## Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/MorganWambulwa/Foodshare_App.git
cd Foodshare_App

2. Backend Setup
Navigate to the server folder and install dependencies:

cd server
npm install
Create a .env file in the server directory and add the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
Start the backend server:

npm run dev
3. Frontend Setup
Open a new terminal, navigate to the client folder, and install dependencies:


cd client
npm install
Start the frontend application:


npm run dev
Testing
This project uses Vitest for backend integration testing to ensure API reliability.
To run the test suite:


cd server
npm test
Test Coverage:

Authentication: Verifies User Registration, Login, and Error Handling.

Donations: Verifies CRUD operations (Create, Read, Update, Delete) for donation listings.

API Endpoints Overview
Method	Endpoint	Description
POST	/api/auth/register	Register a new user (Donor/Receiver/Driver)
POST	/api/auth/login	Authenticate user and get Token
GET	/api/donations	Fetch all available donations
POST	/api/donations	Create a new donation (Donor only)
PUT	/api/donations/:id	Update donation status
DELETE	/api/donations/:id	Remove a donation listing

Screenshots
![Home](<Screenshot 2025-12-12 215350.png>)
![Profile View](<Screenshot 2025-12-12 215403.png>)
![Dashboard](<Screenshot 2025-12-12 215403-1.png>)
![My Requests](<Screenshot 2025-12-12 215448.png>)
![Map View](<Screenshot 2025-12-12 215457.png>)