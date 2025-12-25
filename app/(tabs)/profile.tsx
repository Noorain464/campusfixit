import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { removeToken } from "../../utils/api";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await removeToken();
    router.replace("/login");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
        <Text className="text-white text-3xl font-bold">U</Text>
      </View>
      <Text className="text-xl font-bold">Campus User</Text>
      <TouchableOpacity 
        onPress={handleLogout}
        className="mt-10 bg-red-500 px-8 py-3 rounded-xl"
      >
        <Text className="text-white font-bold">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}