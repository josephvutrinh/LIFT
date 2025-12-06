import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup({ onGoToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    console.log("Signing up with", { name, email, password });
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Background glow */}
      <View className="absolute inset-0 bg-black">
        <View className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <View className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </View>

      <View className="flex-1 px-7 justify-center">
        {/* Branding */}
        <View className="mb-10">
          <Text className="text-neutral-500 font-semibold tracking-[0.25em] uppercase text-xs mb-2">
            LIFT TRACKER
          </Text>
          <Text className="text-white text-4xl font-extrabold mb-1">Create account</Text>
          <Text className="text-neutral-400 text-base">
            Join and start tracking your <Text className="text-emerald-400 font-semibold">progress</Text>.
          </Text>
        </View>

        {/* Card */}
        <View className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-xl shadow-black/40">
          <View className="mb-4">
            <Text className="text-neutral-300 mb-2 text-sm">Name</Text>
            <TextInput
              className="border border-neutral-800/80 bg-neutral-950/60 rounded-2xl px-4 py-3 text-white text-base"
              placeholder="Your name"
              placeholderTextColor="#6b7280"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-neutral-300 mb-2 text-sm">Email</Text>
            <TextInput
              className="border border-neutral-800/80 bg-neutral-950/60 rounded-2xl px-4 py-3 text-white text-base"
              placeholder="you@example.com"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-3">
            <Text className="text-neutral-300 mb-2 text-sm">Password</Text>
            <TextInput
              className="border border-neutral-800/80 bg-neutral-950/60 rounded-2xl px-4 py-3 text-white text-base"
              placeholder="••••••••"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="bg-emerald-500 rounded-full py-3.5 items-center mb-2 active:bg-emerald-400"
            onPress={handleSignup}
          >
            <Text className="text-black font-semibold text-base">Sign up</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-2">
            <Text className="text-neutral-500 text-sm">Already have an account? </Text>
            <TouchableOpacity onPress={onGoToLogin}>
              <Text className="text-emerald-400 font-semibold text-sm">Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}