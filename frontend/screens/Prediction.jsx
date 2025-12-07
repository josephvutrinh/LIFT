import { SectionList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Split({ onBackToProfile }) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="absolute inset-0 bg-black">
        <View className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <View className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </View>

      <View className="flex-1 px-7 pt-12 pb-24">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-extrabold">Prediction</Text>
          {onBackToProfile && (
            <TouchableOpacity onPress={onBackToProfile}>
              <Text className="text-neutral-400 text-sm">Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}