import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#2563eb" }}>
      {/* Main Home/Issues Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Issues",
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          href: null,
          title: "Report Issue",
        }}
      />
    </Tabs>
  );
}