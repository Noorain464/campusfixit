import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getToken } from "../utils/api";
import { View, ActivityIndicator } from "react-native";
import '../global.css';

export default function Index() {
  const router = useRouter(); // Initialize the router
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken(); 
        
        if (token) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return null; 
}