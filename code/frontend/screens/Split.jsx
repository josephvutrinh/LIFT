import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, FlatList, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
/**
 * This is the template editor - changes here don't affect the current week
 * unless user explicitly chooses to update Track screen when saving.
 * @param {Array} split - Default split template array
 * @param {function} onBackToProfile - Navigate back to profile
 * @param {function} onAddDay - Add day to default split
 * @param {function} onRemoveDay - Remove day from default split
 * @param {function} onAddExercise - Add exercise to day
 * @param {function} onRemoveExercise - Remove exercise from day
 * @param {function} onSaveAndUpdateTrack - Apply template changes to working split
 */

export default function Split({ 
  split, 
  onBackToProfile, 
  onAddDay, 
  onRemoveDay, 
  onAddExercise, 
  onRemoveExercise,
  onSaveAndUpdateTrack
}) {
  // Selected day for viewing/editing exercises
  const [selectedDayId, setSelectedDayId] = useState(split[0]?.id ?? null);
  
  // Input for new day name
  const [newDayName, setNewDayName] = useState("");
  
  // Inputs for adding exercises to specific days
  const [exerciseInputs, setExerciseInputs] = useState({});

  const selectedDay = split.find((d) => d.id === selectedDayId) ?? split[0];

  /**
   * Adds a new day to the default split template
   */
  const handleAddDay = () => {
    if (!newDayName.trim()) return;
    onAddDay(newDayName.trim());
    setNewDayName("");
  };

  /**
   * Adds an exercise to the specified day in default split
   */
  const handleAddExercise = (dayId) => {
    const name = (exerciseInputs[dayId] || "").trim();
    if (!name) return;
    onAddExercise(dayId, name);
    setExerciseInputs((prev) => ({ ...prev, [dayId]: "" }));
  };

  /**
   * Deletes a day from the template and updates selected day if necessary
   */
  const handleDeleteDay = (dayId) => {
    onRemoveDay && onRemoveDay(dayId);
    // If deleting the selected day, switch to first available day
    if (selectedDayId === dayId && split.length > 1) {
      const remainingDays = split.filter(d => d.id !== dayId);
      if (remainingDays.length > 0) {
        setSelectedDayId(remainingDays[0].id);
      }
    }
  };

  /**
   * Shows confirmation dialog when saving.
   * Asks user if they want to update the current week's working split.
   */
  const handleSave = () => {
    Alert.alert(
      "Update Track?",
      "Do you want to update your current Track workout with this template?",
      [
        {
          text: "No, just save template",
          onPress: () => {
            Alert.alert("Saved", "Template saved successfully!");
          },
          style: "cancel"
        },
        {
          text: "Yes, update Track now",
          onPress: () => {
            onSaveAndUpdateTrack && onSaveAndUpdateTrack();
            Alert.alert("Updated", "Template saved and Track updated!");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="absolute inset-0 bg-black">
        <View className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <View className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </View>

      <View className="flex-1 px-7 pt-12">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-extrabold">Split</Text>
          {onBackToProfile && (
            <TouchableOpacity onPress={onBackToProfile}>
              <Text className="text-neutral-400 text-sm">Back</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Day chips */}
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
            <Text className="text-neutral-300 mb-2 text-sm">Add exercise to {selectedDay.name}</Text>
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

        {/* Exercises list */}
        {selectedDay ? (
          <View className="flex-1">
            <Text className="text-neutral-300 mb-3 text-sm">Exercises in {selectedDay.name}</Text>
            <FlatList
              data={selectedDay.exercises}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text className="text-neutral-500 text-sm mt-2">
                  No exercises yet. Add one above.
                </Text>
              }
              renderItem={({ item }) => (
                <View className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 mb-3 flex-row items-center justify-between">
                  <Text className="text-white font-medium">{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => onRemoveExercise && onRemoveExercise(selectedDay.id, item.id)}
                  >
                    <Text className="text-red-400 text-sm">Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ) : (
          <Text className="text-neutral-500 text-sm">Add a day to start building your split.</Text>
        )}

        {/* Save button */}
        <View className="py-12">
          <TouchableOpacity
            className="bg-emerald-500 rounded-full py-3.5 items-center active:bg-emerald-400"
            onPress={handleSave}
          >
            <Text className="text-black font-semibold text-base">Save Template</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}