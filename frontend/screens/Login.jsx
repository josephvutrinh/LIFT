import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login({ onGoToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // For now just log values; later you can hook this into real auth
    console.log("Logging in with", { email, password });
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
          <Text className="text-white text-4xl font-extrabold mb-1">Welcome back</Text>
          <Text className="text-neutral-400 text-base">
            Log in and keep your {""}
            <Text className="text-emerald-400 font-semibold">progress</Text> moving.
          </Text>
        </View>

        {/* Card */}
        <View className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 shadow-xl shadow-black/40">
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
              placeholder="Enter your password"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View className="items-end mb-4">
            <Text className="text-xs text-neutral-500">Forgot password?</Text>
          </View>

          <TouchableOpacity
            className="bg-emerald-500 rounded-full py-3.5 items-center mb-2 active:bg-emerald-400"
            onPress={handleLogin}
          >
            <Text className="text-black font-semibold text-base">Log in</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-2">
            <Text className="text-neutral-500 text-sm">New here? </Text>
            <TouchableOpacity onPress={onGoToSignup}>
              <Text className="text-emerald-400 font-semibold text-sm">Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
