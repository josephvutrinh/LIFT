import "./global.css";
import React, { useState } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Profile from "./screens/Profile";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setScreen("profile");
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
  };

  return (
    <SafeAreaProvider>
      {screen === "login" && (
        <Login onGoToSignup={() => setScreen("signup")} onAuthSuccess={handleAuthSuccess} />
      )}
      {screen === "signup" && (
        <Signup onGoToLogin={() => setScreen("login")} onAuthSuccess={handleAuthSuccess} />
      )}
      {screen === "profile" && <Profile user={user} onLogout={handleLogout} />}
    </SafeAreaProvider>
  );
}
