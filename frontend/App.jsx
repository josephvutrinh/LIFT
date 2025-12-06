import "./global.css";
import React, { useState } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Login from "./screens/Login";
import Signup from "./screens/Signup";

export default function App() {
  const [screen, setScreen] = useState("login");

  return (
    <SafeAreaProvider>
      {screen === "login" ? (
        <Login onGoToSignup={() => setScreen("signup")} />
      ) : (
        <Signup onGoToLogin={() => setScreen("login")} />
      )}
    </SafeAreaProvider>
  );
}