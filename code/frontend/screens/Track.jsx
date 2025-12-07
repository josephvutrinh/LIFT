/**
 * Uses the working split (current week's editable copy) and logs all sets
 * with the current week ID for tracking purposes.
 * @param {Array} split - Working split array with days and exercises
 * @param {Array} logs - All workout logs
 * @param {string} currentWeekId - ID of the current training week
 * @param {function} onAddDay - Add a new day to working split
 * @param {function} onDeleteDay - Remove a day from working split
 * @param {function} onAddExercise - Add exercise to a day
 * @param {function} onDeleteExercise - Remove exercise from a day
 * @param {function} onAddSet - Log a new set
 * @param {function} onDeleteSet - Remove a logged set
 * @param {function} onSubmitWeek - Submit current week and reset for next week
 */

import { useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, FlatList, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Track({
  split,
  logs,
  currentWeekId,
  onAddDay,
  onDeleteDay,
  onAddExercise,
  onDeleteExercise,
  onAddSet,
  onDeleteSet,
  onSubmitWeek,
}) {
  // Selected day ID for viewing/editing exercises
  const [selectedDayId, setSelectedDayId] = useState(split[0]?.id ?? null);
  
  // Input for adding a new day
  const [newDayName, setNewDayName] = useState("");
  
  // Inputs for adding exercises to specific days
  const [exerciseInputs, setExerciseInputs] = useState({});
  
  // Inputs for logging sets (reps and weight) for specific exercises
  const [setInputs, setSetInputs] = useState({});

  // Memoized selected day to prevent unnecessary recalculations
  const selectedDay = useMemo(
    () => split.find((d) => d.id === selectedDayId) ?? split[0],
    [split, selectedDayId],
  );

  /**
   * Adds a new day to the working split
   */
  const handleAddDay = () => {
    if (!newDayName.trim()) return;
    onAddDay(newDayName.trim());
    setNewDayName("");
  };

  /**
   * Adds a new exercise to the specified day
   */
  const handleAddExercise = (dayId) => {
    const name = (exerciseInputs[dayId] || "").trim();
    if (!name) return;
    onAddExercise(dayId, name);
    setExerciseInputs((prev) => ({ ...prev, [dayId]: "" }));
  };

  /**
   * Updates reps or weight input for a specific exercise
   */
  const updateSetInput = (exerciseId, field, value) => {
    setSetInputs((prev) => ({
      ...prev,
      [exerciseId]: {
        reps: prev[exerciseId]?.reps || "",
        weight: prev[exerciseId]?.weight || "",
        [field]: value,
      },
    }));
  };

  /**
   * Logs a set for the specified exercise with reps and weight
   */
  const handleAddSet = (exerciseId) => {
    const data = setInputs[exerciseId];
    if (!data) return;
    const reps = Number(data.reps);
    const weight = Number(data.weight);
    if (!reps || !weight) return;
    onAddSet(selectedDay.id, exerciseId, reps, weight);
    setSetInputs((prev) => ({ ...prev, [exerciseId]: { reps: "", weight: "" } }));
  };

  /**
   * Deletes a logged set
   */
  const handleDeleteSet = (setId) => {
    onDeleteSet && onDeleteSet(setId);
  };

  /**
   * Deletes an exercise from a specific day
   */
  const handleDeleteExercise = (dayId, exerciseId) => {
    onDeleteExercise && onDeleteExercise(dayId, exerciseId);
  };

  /**
   * Deletes a day and updates selected day if necessary
   */
  const handleDeleteDay = (dayId) => {
    onDeleteDay && onDeleteDay(dayId);
    // If deleting the selected day, switch to first available day
    if (selectedDayId === dayId && split.length > 1) {
      const remainingDays = split.filter(d => d.id !== dayId);
      if (remainingDays.length > 0) {
        setSelectedDayId(remainingDays[0].id);
      }
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Background glow */}
      <View className="absolute inset-0 bg-black">
        <View className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <View className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </View>

      <View className="flex-1 px-7 pt-12">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-extrabold">Track workout</Text>
        </View>

        {/* Day chips - Fixed */}
        <View className="mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {split.map((day) => {
                const active = selectedDay && day.id === selectedDay.id;
                return (
                  <TouchableOpacity
                    key={day.id}
                    className={`px-4 py-2 h-12 rounded-full border justify-center items-center ${
                      active ? "bg-emerald-500 border-emerald-500" : "border-neutral-700 bg-neutral-900"
                    }`}
                    onPress={() => setSelectedDayId(day.id)}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        active ? "text-black" : "text-neutral-200"
                      }`}
                    >
                      {day.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Add day */}
        <View className="mb-4">
          <Text className="text-neutral-300 mb-2 text-sm">Add day</Text>
          <View className="flex-row items-center gap-2">
            <TextInput
              className="flex-1 border border-neutral-800 bg-neutral-950/60 rounded-2xl px-4 py-3 text-white text-base"
              placeholder="e.g. Push, Pull, Legs"
              placeholderTextColor="#6b7280"
              value={newDayName}
              onChangeText={setNewDayName}
            />
            <TouchableOpacity
              className="bg-neutral-800 rounded-full px-4 py-2 border border-neutral-700"
              onPress={handleAddDay}
            >
              <Text className="text-neutral-100 font-semibold text-sm">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delete current day */}
        {selectedDay && split.length > 1 && (
          <View className="mb-4">
            <TouchableOpacity
              className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 items-center"
              onPress={() => handleDeleteDay(selectedDay.id)}
            >
              <Text className="text-red-400 font-semibold text-sm">Delete "{selectedDay.name}" day</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Add exercise */}
        {selectedDay && (
          <View className="mb-4">
            <Text className="text-neutral-300 mb-2 text-sm">Add exercise</Text>
            <View className="flex-row items-center gap-2">
              <TextInput
                className="flex-1 border border-neutral-800 bg-neutral-950/60 rounded-2xl px-4 py-3 text-white text-base"
                placeholder="e.g. Bench Press"
                placeholderTextColor="#6b7280"
                value={exerciseInputs[selectedDay.id] || ""}
                onChangeText={(text) =>
                  setExerciseInputs((prev) => ({
                    ...prev,
                    [selectedDay.id]: text,
                  }))
                }
              />
              <TouchableOpacity
                className="bg-neutral-800 rounded-full px-4 py-2 border border-neutral-700"
                onPress={() => handleAddExercise(selectedDay.id)}
              >
                <Text className="text-neutral-100 font-semibold text-sm">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Scrollable exercises section */}
        {selectedDay ? (
          <FlatList
            data={selectedDay.exercises}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text className="text-neutral-500 text-sm mt-2">
                No exercises yet. Add one above to start logging sets.
              </Text>
            }
            renderItem={({ item }) => {
              const input = setInputs[item.id] || { reps: "", weight: "" };
              const exerciseSets = logs.filter(
                (log) =>
                  log.weekId === currentWeekId &&
                  log.dayId === selectedDay.id &&
                  log.exerciseId === item.id,
              );

              return (
                <View className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-4 mb-3">
                  <Text className="text-white font-semibold mb-2">{item.name}</Text>

                  {/* Existing sets */}
                  {exerciseSets.length > 0 && (
                    <View className="mb-2 gap-1 pl-2">
                      {exerciseSets.map((set, index) => (
                        <View
                          key={set.id}
                          className="flex-row items-center justify-between"
                        >
                          <Text className="text-neutral-300 text-sm">
                            Set {index + 1}: {set.reps} reps @ {set.weight} lbs
                          </Text>
                          <TouchableOpacity
                            onPress={() => onDeleteSet && onDeleteSet(set.id)}
                          >
                            <Text className="text-xs text-red-400">Delete</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Inputs to add a new set */}
                  <View className="flex-row items-center gap-2 mb-2">
                    
                    <TextInput
                      className="flex-1 border border-neutral-800 bg-neutral-950/60 rounded-2xl px-3 py-2 text-white text-sm"
                      placeholder="Reps"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
                      value={input.reps}
                      onChangeText={(text) => updateSetInput(item.id, "reps", text)}
                    />

                    <TextInput
                      className="flex-1 border border-neutral-800 bg-neutral-950/60 rounded-2xl px-3 py-2 text-white text-sm"
                      placeholder="Weight (lbs)"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
                      value={input.weight}
                      onChangeText={(text) => updateSetInput(item.id, "weight", text)}
                    />

                    <TouchableOpacity
                      className="bg-emerald-500 rounded-full px-4 py-2"
                      onPress={() => handleAddSet(item.id)}
                    >
                      <Text className="text-black font-semibold text-xs">Add set</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="bg-red-500 rounded-full px-4 py-2"
                      onPress={() => handleDeleteExercise(selectedDay.id, item.id)}
                    >
                      <Text className="text-black font-semibold text-xs">Delete</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              );
            }}
          />
        ) : (
          <Text className="text-neutral-500 text-sm">Add a day to start tracking.</Text>
        )}
        {/* Submit week button */}
        <View className="mt-4 mb-12">
          <TouchableOpacity
            className="bg-emerald-500 rounded-full py-3.5 items-center active:bg-emerald-400"
            onPress={onSubmitWeek}
          >
            <Text className="text-black font-semibold text-base">Submit week</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
