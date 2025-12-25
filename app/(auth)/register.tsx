import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { authApi, saveToken } from "../../utils/api";

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await authApi.signup(name, email, password);

      // Expected backend response: { token, user }
      await saveToken(response.token);

      router.replace("/(tabs)");
    } catch (err) {
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-2 text-center">
        Create Account
      </Text>

      <Text className="text-gray-500 text-center mb-8">
        Join Campus FixIt
      </Text>

      {error ? (
        <Text className="text-red-500 text-center mb-4">
          {error}
        </Text>
      ) : null}

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="bg-black py-3 rounded-lg"
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Sign Up
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6"
        onPress={() => router.replace("/login")}
      >
        <Text className="text-center text-gray-600">
          Already have an account?{" "}
          <Text className="font-semibold text-black">
            Login
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
