import "./global.css";
import React, { useState } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from "expo-constants";

import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Profile from "./screens/Profile";
import Track from "./screens/Track";
import History from "./screens/History";
import Split from "./screens/Split";
import Prediction from "./screens/Prediction";
import NavBar from "./components/NavBar";

/**
 * Creates the initial workout split with default Push/Pull/Legs structure.
 * Each day contains a unique ID, name, and list of exercises.
 * @returns {Array} Array of day objects with exercises
 */
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

/**
 * Returns today's date in ISO format (YYYY-MM-DD)
 * @returns {string} Date string
 */
const todayIso = () => new Date().toISOString().slice(0, 10);

export default function App() {
  // Navigation state - determines which screen to display
  const [screen, setScreen] = useState("login");
  
  // User authentication state - stores user data and JWT token
  const [user, setUser] = useState(null);
  
  // Default split template - the master template for workout structure
  const [defaultSplit, setDefaultSplit] = useState(createInitialSplit);
  
  // Working split - current week's editable split (copy of default)
  const [workingSplit, setWorkingSplit] = useState(createInitialSplit);
  
  // Workout logs - array of sets with structure: { id, weekId, date, dayId, exerciseId, reps, weight }
  const [logs, setLogs] = useState([]);
  
  // Unique identifier for the current training week
  const [currentWeekId, setCurrentWeekId] = useState(() => Date.now().toString(36));
  
  // Submitted weeks - tracks completed weeks with structure: { id, submittedAt }
  const [weeks, setWeeks] = useState([]);

  /**
   * Handles successful authentication (login/signup)
   * @param {Object} userData - User data from backend including token
   */
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setScreen("profile");
  };

  /**
   * Logs out the current user and returns to login screen
   */
  const handleLogout = () => {
    setUser(null);
    setScreen("login");
  };

  /**
   * Deletes the user's account from the backend and logs them out.
   * Makes a DELETE request to /api/auth/user with JWT authentication.
   */
  const handleDeleteAccount = async () => {
    try {
      const token = user?.token;
      if (!token) {
        handleLogout();
        return;
      }

      const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/user`, {
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
        // Try to parse error response
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          alert(data.message || "Failed to delete account");
        } else {
          const text = await response.text();
          alert(`Failed to delete account: ${response.status} - ${text.substring(0, 100)}`);
        }
      }
    } catch (error) {
      alert("Error deleting account: " + error.message);
    }
  };

  // ===== DEFAULT SPLIT MANAGEMENT =====
  // These functions modify the default split template (used in Split screen)
  
  /**
   * Adds a new day to the default split template
   * @param {string} name - Name of the day (e.g., "Push", "Pull", "Legs")
   */
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
  
  /**
   * Removes a day from the default split template
   * @param {string} dayId - Unique ID of the day to remove
   */
  const removeDefaultDay = (dayId) => {
    setDefaultSplit((prev) => prev.filter((day) => day.id !== dayId));
  };

  /**
   * Adds an exercise to a specific day in the default split
   * @param {string} dayId - ID of the day to add exercise to
   * @param {string} name - Name of the exercise (e.g., "Bench Press")
   */
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
  
  /**
   * Removes an exercise from a specific day in the default split
   * @param {string} dayId - ID of the day containing the exercise
   * @param {string} exerciseId - ID of the exercise to remove
   */
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

  /**
   * Updates the working split to match the current default split template.
   * Used when user wants to apply template changes to their current week.
   * Creates a deep copy to avoid reference sharing.
   */
  const updateWorkingFromDefault = () => {
    setWorkingSplit(JSON.parse(JSON.stringify(defaultSplit)));
  };
  // split management
  // These functions modify the current week's working split (used in Track screen)
  
  /**
   * Adds a new day to the working split for the current week
   * @param {string} name - Name of the day
   */
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
  
  /**
   * Removes a day from the working split
   * @param {string} dayId - ID of the day to remove
   */
  const removeWorkingDay = (dayId) => {
    setWorkingSplit((prev) => prev.filter((day) => day.id !== dayId));
  };

  /**
   * Adds an exercise to a specific day in the working split
   * @param {string} dayId - ID of the day
   * @param {string} name - Name of the exercise
   */
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
  
  /**
   * Removes an exercise from a specific day in the working split
   * @param {string} dayId - ID of the day
   * @param {string} exerciseId - ID of the exercise to remove
   */
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

  // Logging workouts
  // Functions for managing individual sets and workout submissions
  
  /**
   * Logs a set for a specific exercise.
   * Creates a log entry with current week ID and today's date.
   * @param {string} dayId - ID of the day
   * @param {string} exerciseId - ID of the exercise
   * @param {number} reps - Number of repetitions
   * @param {number} weight - Weight in pounds
   */
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

  /**
   * Deletes a specific set from the logs
   * @param {string} setId - ID of the set to delete
   */
  const deleteSet = (setId) => {
    setLogs((prev) => prev.filter((entry) => entry.id !== setId));
  };

  /**
   * Submits the current week's workout.
   * - Adds week to submitted weeks array
   * - Resets working split to default template
   * - Generates new week ID for next week
   * Only submits if there are logged sets for the current week.
   */
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

    // Reset working split to default template for next week
    setWorkingSplit(JSON.parse(JSON.stringify(defaultSplit)));
    setCurrentWeekId(Date.now().toString(36));
  };

  // Rendering UI based on current screen state
  // Conditional rendering based on current screen state
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