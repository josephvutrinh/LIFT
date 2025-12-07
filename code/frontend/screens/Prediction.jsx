import { Text, TouchableOpacity, View, TextInput, Keyboard, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { predictPRWeeks } from '../utils/PredictionModel'; // Adjust path if needed

export default function Prediction({ logs, split, onBackToProfile }) {
  const [targetWeight, setTargetWeight] = useState('');
  const [predictionResult, setPredictionResult] = useState(null); // null, number, or string error

  const handlePrediction = () => {
    Keyboard.dismiss(); // Hide keyboard

    const weight = Number(targetWeight);
    if (!weight || weight <= 0) {
      return Alert.alert("Invalid Input", "Please enter a valid target weight in pounds.");
    }

    const result = predictPRWeeks(logs, split, weight);
    setPredictionResult(result);
  };

  const renderPrediction = () => {
    if (predictionResult === null) return null;

    if (predictionResult === "Not enough data") {
      return (
        <Text className="text-red-400 text-lg font-semibold mt-4 text-center">
          Not enough data
        </Text>
      );
    }
    
    if (typeof predictionResult === 'string' && predictionResult.startsWith('>')) {
        const weeks = predictionResult.replace('>', '').trim();
        return (
            <View className="mt-6 p-4 rounded-xl border border-neutral-700 bg-neutral-900/70">
                <Text className="text-white text-xl font-bold text-center">
                    Prediction is Unreliable
                </Text>
                <Text className="text-neutral-400 text-sm mt-1 text-center">
                    (Progress rate is too slow or negative.)
                </Text>
            </View>
        );
    }

    const isReached = predictionResult <= 0;
    const weeksText = isReached ? "Already Achieved" : `${predictionResult} Weeks`;

    return (
      <View className="mt-6 p-4 rounded-xl border border-emerald-700 bg-emerald-900/20">
        <Text className="text-neutral-400 text-sm font-medium text-center">
            Estimated Time to {targetWeight} lbs 1RM:
        </Text>
        <Text className={`text-4xl font-extrabold mt-1 text-center ${isReached ? 'text-green-400' : 'text-emerald-400'}`}>
          {weeksText}
        </Text>
        {isReached && (
            <Text className="text-green-400 text-sm mt-1 text-center">
                Your highest estimated 1RM is already {targetWeight} lbs or higher!
            </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="absolute inset-0 bg-black">
        <View className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <View className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </View>

      <View className="flex-1 px-7 pt-12 pb-24">
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-white text-2xl font-extrabold">PR Prediction (Bench)</Text>
          {onBackToProfile && (
            <TouchableOpacity onPress={onBackToProfile}>
              <Text className="text-neutral-400 text-sm">Back</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Input Block */}
        <View className="mb-8 p-4 rounded-xl border border-neutral-800 bg-neutral-900/70">
          <Text className="text-neutral-300 mb-2 text-base">Target Bench Press (1RM lbs)</Text>
          <TextInput
            className="border border-neutral-700 bg-neutral-950/60 rounded-xl px-4 py-3 text-white text-lg"
            placeholder="e.g., 225"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={targetWeight}
            onChangeText={setTargetWeight}
          />
        </View>

        {/* Prediction Button */}
        <TouchableOpacity
          className="bg-emerald-500 rounded-full py-3.5 items-center active:bg-emerald-400"
          onPress={handlePrediction}
        >
          <Text className="text-black font-semibold text-base">Predict PR Date</Text>
        </TouchableOpacity>
        
        {renderPrediction()}
        
      </View>
    </SafeAreaView>
  );
}