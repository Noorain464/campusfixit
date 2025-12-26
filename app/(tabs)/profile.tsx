import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {

  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();

    router.replace("/login");
  };
  if (loading) return <ActivityIndicator size="large" className="mt-20" />;
  if (!user) return <Text className="text-center mt-20">Please login again</Text>;


  return (

    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-3xl font-bold mb-8">Profile</Text>

        <View className="bg-gray-50 p-6 rounded-2xl mb-6">
          <View className="mb-4">
            <Text className="text-gray-400 text-xs uppercase font-bold">Name</Text>
            <Text className="text-lg font-semibold">{user?.name || "N/A"}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-400 text-xs uppercase font-bold">Email</Text>
            <Text className="text-lg font-semibold">{user?.email || "N/A"}</Text>
          </View>

          <View>
            <Text className="text-gray-400 text-xs uppercase font-bold">Role</Text>
            <Text className="text-lg font-semibold capitalize">{user?.role || "Student"}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 py-4 rounded-xl shadow-sm"
        >
          <Text className="text-white text-center font-bold text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}