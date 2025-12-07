# LIFT - Fitness Tracking & Prediction App

## Project Overview and Purpose

LIFT is a fitness tracking mobile application built with React Native and Expo. The app helps users log their workouts, manage custom training splits, track progress over time, and predict future one-rep max (1RM) performance using machine learning.

**Key Features:**
- **User Authentication**: Secure signup and login with JWT-based authentication
- **Workout Tracking**: Log sets, reps, and weight for each exercise in real-time
- **Custom Split Management**: Create and customize workout split templates (Push/Pull/Legs, etc.)
- **History Tracking**: View past workout sessions and track progress over weeks
- **ML-Based PR Prediction**: Predict when you'll achieve your target bench press 1RM using linear regression

## Video Link

🎥 [Project Demo Video](https://youtu.be/b1CTzIB_HbU)

## Installation and Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator, or physical device with Expo Go app

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/josephvutrinh/LIFT.git
   cd LIFT/code/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the `code/backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   PORT=3001
   ```

4. **Start the backend server:**
   ```bash
   node server.js
   ```
   Server will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create or update `app.config.js` with your API URL:
   ```javascript
   export default {
     expo: {
       // ... other config
       extra: {
         API_BASE_URL: "http://YOUR_LOCAL_IP:3001/api/auth"
       }
     }
   };
   ```
   
   For physical device testing, replace `YOUR_LOCAL_IP` with your computer's local network IP (e.g., `172.16.46.52`). For iOS Simulator, use `localhost`.

4. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

5. **Run the app:**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

## Technologies and Libraries Used

### Frontend
- **React Native**: Cross-platform mobile app framework
- **Expo**: Development platform and toolchain
- **NativeWind**: Tailwind CSS for React Native styling
- **Axios**: HTTP client for API requests
- **expo-constants**: Environment variable management

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT (jsonwebtoken)**: Authentication token generation

### Machine Learning
- Custom implementation of linear regression for PR prediction
- Epley formula for 1RM estimation

## Author(s) and Contribution Summary

**Joseph Vu Trinh**
- Complete application architecture and implementation
- Frontend: React Native UI/UX, workout tracking, split management
- Backend: RESTful API design, authentication system, database modeling
- ML Feature: Prediction model implementation using linear regression
- Database: MongoDB schema design and integration