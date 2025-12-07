
import { Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
/**
 * User Profile Screen
 * @param {Object} user - Current user object with name and email
 * @param {function} onLogout - Callback to log out user
 * @param {function} onDeleteAccount - Callback to delete user account
 * @param {function} onGoToHistory - Navigate to History screen
 * @param {function} onGoToSplit - Navigate to Split screen
 * @param {function} onGoToPrediction - Navigate to Prediction screen
 */

export default function Profile({ user, onLogout, onDeleteAccount, onGoToHistory, onGoToSplit, onGoToPrediction }) {
  const name = user?.name || "Athlete";
  const email = user?.email || "unknown";
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  /**
   * Shows confirmation dialog before deleting account.
   * Warns user that action is irreversible.
   */
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDeleteAccount && onDeleteAccount();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Background glow */}
      <View className="absolute inset-0 bg-black">
        <View className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <View className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </View>

      <View className="flex-1 px-7 pt-16">
        <Text className="text-neutral-500 font-semibold tracking-[0.25em] uppercase text-xs mb-2">
          PROFILE
        </Text>
        <Text className="text-white text-3xl font-extrabold mb-6">Your account</Text>

        {/* Card */}
        <View className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-xl shadow-black/40 mb-4 flex-row items-center">
          <View className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 items-center justify-center mr-4">
            <Text className="text-2xl font-bold text-emerald-300">{initial}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold" numberOfLines={1}>{name}</Text>
            <Text className="text-neutral-400 text-sm" numberOfLines={1}>{email}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onGoToHistory}
          className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-5 mt-3"
        >
          <Text className="text-neutral-300 font-semibold mb-2 text-sm">Training summary</Text>
          <Text className="text-neutral-500 text-sm">
            Tap to view your past workouts and weekly volume.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onGoToSplit}
          className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-5 mt-3"
        >
          <Text className="text-neutral-300 font-semibold mb-2 text-sm">Split</Text>
          <Text className="text-neutral-500 text-sm">
            Tap to edit your split.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onGoToPrediction}
          className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-5 mt-3"
        >
          <Text className="text-neutral-300 font-semibold mb-2 text-sm">Bench Prediction (Beta)</Text>
          <Text className="text-neutral-500 text-sm">
            Tap to find out when your next bench press PR might be.
          </Text>
        </TouchableOpacity>

        

        <View className="mt-auto mb-12">
          <TouchableOpacity
            className="bg-neutral-800 rounded-full py-3.5 items-center border border-neutral-700 active:bg-neutral-700 mb-3"
            onPress={onLogout}
          >
            <Text className="text-neutral-300 font-semibold text-base">Log out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-red-500/10 border border-red-500/30 rounded-full py-3.5 items-center active:bg-red-500/20"
            onPress={handleDeleteAccount}
          >
            <Text className="text-red-400 font-semibold text-base">Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}