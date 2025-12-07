
import { useMemo } from "react";
import { SectionList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
/**
 * Displays all past workout sessions organized by submitted weeks.
 * Shows each logged set with exercise name, day, reps, and weight.
 * Uses SectionList to group logs by week for easy navigation.
 * 
 * @param {Array} split - Default split (used to lookup day/exercise names)
 * @param {Array} logs - All workout logs with set data
 * @param {Array} weeks - Array of submitted weeks
 * @param {function} onBackToProfile - Navigate back to profile
 */

export default function History({ split, logs, weeks, onBackToProfile }) {
  /**
   * Groups logs by week and formats them for SectionList.
   * Each section represents one submitted week.
   */
  const sections = useMemo(() => {
    if (!weeks || weeks.length === 0) return [];

    return weeks
      .map((week) => {
        const weekLogs = logs.filter((log) => log.weekId === week.id);
        if (weekLogs.length === 0) return null;

        const dates = weekLogs.map((l) => l.date).sort();
        const label = `Week of ${dates[0]}`;

        return {
          title: label,
          data: weekLogs,
        };
      })
      .filter(Boolean);
  }, [weeks, logs]);

  /**
   * Looks up day name from split by day ID
   */
  const getDayName = (dayId) => split.find((d) => d.id === dayId)?.name || dayId;

  /**
   * Looks up exercise name from split by exercise ID
   */
  const getExerciseName = (exerciseId) => {
    for (const day of split) {
      const ex = day.exercises.find((e) => e.id === exerciseId);
      if (ex) return ex.name;
    }
    return exerciseId;
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="absolute inset-0 bg-black">
        <View className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <View className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </View>

      <View className="flex-1 px-7 pt-12 pb-24">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-extrabold">History</Text>
          {onBackToProfile && (
            <TouchableOpacity onPress={onBackToProfile}>
              <Text className="text-neutral-400 text-sm">Back</Text>
            </TouchableOpacity>
          )}
        </View>

        {sections.length === 0 ? (
          <Text className="text-neutral-500 text-sm mt-4">
            No sets logged yet. Log a workout from the Track tab to see it here.
          </Text>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderSectionHeader={({ section: { title } }) => (
              <Text className="text-neutral-400 text-xs font-semibold mt-6 mb-2">
                {title}
              </Text>
            )}
            renderItem={({ item }) => (
              <View className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 mb-2">
                <Text className="text-neutral-300 text-xs mb-1">
                  {getDayName(item.dayId)} • {getExerciseName(item.exerciseId)}
                </Text>
                <Text className="text-white font-semibold text-sm">
                  {item.reps} reps @ {item.weight} lbs
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}