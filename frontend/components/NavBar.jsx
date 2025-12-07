import { Text, TouchableOpacity, View } from "react-native";

export default function NavBar({ current, onChange }) {
  const isProfile = current === "profile";
  const isTrack = current === "track" || current === "history";

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-black/95 border-t border-neutral-800 py-6 flex-row justify-between items-center">
      <TouchableOpacity
        className={`flex-1 items-center ${isTrack ? "" : "opacity-70"}`}
        onPress={() => onChange("track")}>
        <Text className={`text-sm font-semibold ${isTrack ? "text-emerald-400" : "text-neutral-400"}`}>
          Track
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 items-center ${isProfile ? "" : "opacity-70"}`}
        onPress={() => onChange("profile")}>
        <Text className={`text-sm font-semibold ${isProfile ? "text-emerald-400" : "text-neutral-400"}`}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
