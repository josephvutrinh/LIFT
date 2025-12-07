import "./global.css";
import React, { useState } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View } from "react-native";

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Profile from "./screens/Profile";
import Track from "./screens/Track";
import History from "./screens/History";
import Split from "./screens/Split";
import Prediction from "./screens/Prediction";
import NavBar from "./components/NavBar";

// Simple helpers to seed some default days/exercises
const createInitialSplit = () => [
  {
    id: "push",
    name: "Push",
    exercises: [
      { id: "bench_press", name: "Bench Press" },
      { id: "incline_db_press", name: "Incline DB Press" },
    ],
  },
  {
    id: "pull",
    name: "Pull",
    exercises: [
      { id: "barbell_row", name: "Barbell Row" },
      { id: "lat_pulldown", name: "Lat Pulldown" },
    ],
  },
  {
    id: "legs",
    name: "Legs",
    exercises: [
      { id: "back_squat", name: "Back Squat" },
      { id: "rdl", name: "Romanian Deadlift" },
    ],
  },
];

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [defaultSplit, setDefaultSplit] = useState(createInitialSplit); // Template split
  const [workingSplit, setWorkingSplit] = useState(createInitialSplit); // Current week's split
  const [logs, setLogs] = useState([]); // { id, weekId, date, dayId, exerciseId, reps, weight }
  const [currentWeekId, setCurrentWeekId] = useState(() => Date.now().toString(36));
  const [weeks, setWeeks] = useState([]); // { id, submittedAt }

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setScreen("profile");
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
  };

  const handleDeleteAccount = async () => {
    try {
      const token = user?.token;
      if (!token) {
        handleLogout();
        return;
      }

      const response = await fetch(`${process.env.API_BASE_URL}/user`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        // Account deleted successfully
        setUser(null);
        setScreen("login");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete account");
      }
    } catch (error) {
      alert("Error deleting account: " + error.message);
    }
  };

  // Functions for managing the DEFAULT SPLIT (template)
  const addDefaultDay = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setDefaultSplit((prev) => [
      ...prev,
      {
        id: `${Date.now().toString(36)}_${prev.length}`,
        name: trimmed,
        exercises: [],
      },
    ]);
  };
  
  const removeDefaultDay = (dayId) => {
    setDefaultSplit((prev) => prev.filter((day) => day.id !== dayId));
  };

  const addDefaultExercise = (dayId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setDefaultSplit((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: [
                ...day.exercises,
                { id: `${dayId}_${Date.now().toString(36)}`, name: trimmed },
              ],
            }
          : day,
      ),
    );
  };
  
  const removeDefaultExercise = (dayId, exerciseId) => {
    setDefaultSplit((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.filter((ex) => ex.id !== exerciseId),
            }
          : day,
      ),
    );
  };

  // Function to update working split from default template
  const updateWorkingFromDefault = () => {
    setWorkingSplit(JSON.parse(JSON.stringify(defaultSplit)));
  };

  // Functions for managing the WORKING SPLIT (current week)
  const addWorkingDay = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setWorkingSplit((prev) => [
      ...prev,
      {
        id: `${Date.now().toString(36)}_${prev.length}`,
        name: trimmed,
        exercises: [],
      },
    ]);
  };
  
  const removeWorkingDay = (dayId) => {
    setWorkingSplit((prev) => prev.filter((day) => day.id !== dayId));
  };

  const addWorkingExercise = (dayId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setWorkingSplit((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: [
                ...day.exercises,
                { id: `${dayId}_${Date.now().toString(36)}`, name: trimmed },
              ],
            }
          : day,
      ),
    );
  };
  
  const removeWorkingExercise = (dayId, exerciseId) => {
    setWorkingSplit((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.filter((ex) => ex.id !== exerciseId),
            }
          : day,
      ),
    );
  };

  const addSet = (dayId, exerciseId, reps, weight) => {
    const date = todayIso();
    setLogs((prev) => [
      ...prev,
      {
        id: `${Date.now().toString(36)}_${prev.length}`,
        weekId: currentWeekId,
        date,
        dayId,
        exerciseId,
        reps,
        weight,
      },
    ]);
  };

  const deleteSet = (setId) => {
    setLogs((prev) => prev.filter((entry) => entry.id !== setId));
  };

  const submitCurrentWeek = () => {
    const hasEntries = logs.some((entry) => entry.weekId === currentWeekId);
    if (!hasEntries) return;

    setWeeks((prev) => [
      ...prev,
      {
        id: currentWeekId,
        submittedAt: new Date().toISOString(),
      },
    ]);

    // Reset working split to default template (deep copy)
    setWorkingSplit(JSON.parse(JSON.stringify(defaultSplit)));
    setCurrentWeekId(Date.now().toString(36));
  };

  return (
    <SafeAreaProvider>
      {screen === "login" && (
        <Login onGoToSignup={() => setScreen("signup")} onAuthSuccess={handleAuthSuccess} />
      )}
      {screen === "signup" && (
        <Signup onGoToLogin={() => setScreen("login")} onAuthSuccess={handleAuthSuccess} />
      )}
      {screen === "profile" && (
        <Profile
          user={user}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onGoToTrack={() => setScreen("track")} 
          onGoToHistory={() => setScreen("history")}
          onGoToSplit={() => setScreen("split")}
          onGoToPrediction={() => setScreen("prediction")}
        />
      )}
      {screen === "track" && (
        <Track
          split={workingSplit}
          logs={logs}
          currentWeekId={currentWeekId}
          onAddDay={addWorkingDay}
          onDeleteDay={removeWorkingDay}
          onAddExercise={addWorkingExercise}
          onDeleteExercise={removeWorkingExercise}
          onAddSet={addSet}
          onDeleteSet={deleteSet}
          onSubmitWeek={submitCurrentWeek}
        />
      )}
      {screen === "history" && (
        <History
          split={defaultSplit}
          logs={logs}
          weeks={weeks}
          onBackToProfile={() => setScreen("profile")}
        />
      )}
      {screen === "split" && (
        <Split
          split={defaultSplit}
          onBackToProfile={() => setScreen("profile")}
          onAddDay={addDefaultDay}
          onRemoveDay={removeDefaultDay}
          onAddExercise={addDefaultExercise}
          onRemoveExercise={removeDefaultExercise}
          onSaveAndUpdateTrack={updateWorkingFromDefault}
        />
      )}
      {screen === "prediction" && (
        <Prediction 
          logs={logs}
          split={defaultSplit}
          onBackToProfile={() => setScreen("profile")}
        />
      )}

      {/* Bottom nav visible on authenticated screens */}
      {screen !== "login" && screen !== "signup" && (
        <NavBar current={screen} onChange={setScreen} />
      )}
    </SafeAreaProvider>
  );
}