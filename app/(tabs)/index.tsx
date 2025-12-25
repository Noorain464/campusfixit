import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { authApi, issueApi } from "../../utils/api";

export type Issue = {
  _id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved";
  category: string;
  createdAt?: string;
};
export type User = {
  _id: string;
  name: string;
  email: string;
  role: "student" | "admin";
};


const categories = ["All", "Electrical", "Water", "Internet", "Infrastructure"];
const statuses = ["All", "Open", "In Progress", "Resolved"];
export default function HomeScreen() {
  const router = useRouter();

  const [issues, setIssues] = useState<Issue[]>([]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);


  const loadData = async () => {
    try {
      setLoading(true);

      const res = await authApi.getCurrentUser();
      console.log("ME RESPONSE 👉", res);

      const currentUser = res.user || res;
      console.log("USER 👉", currentUser);

      setUser(currentUser);

      let issuesRes;
      if (currentUser?.role === "admin") {
        issuesRes = await issueApi.getAllIssues();
      } else {
        issuesRes = await issueApi.getMyIssues();
      }

      console.log("ISSUES RESPONSE 👉", issuesRes);

      setIssues(Array.isArray(issuesRes) ? issuesRes : issuesRes.issues || []);
    } catch (err) {
      console.error("LOAD DATA ERROR 👉", err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    loadData();
  }, []);

  const renderStatus = (status: string) => {
    let color = "bg-gray-300";
    if (status === "Open") color = "bg-red-500";
    if (status === "In Progress") color = "bg-yellow-500";
    if (status === "Resolved") color = "bg-green-500";

    return (
      <View className={`px-2 py-1 rounded-full ${color}`}>
        <Text className="text-white text-xs font-semibold">
          {status}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 mb-3 rounded-lg shadow-sm">
      <Text className="text-lg font-semibold mb-1">
        {item.title}
      </Text>

      <Text className="text-gray-500 mb-2">
        {item.category}
      </Text>

      <View className="flex-row justify-between items-center">
        {renderStatus(item.status)}
        <Text className="text-gray-400 text-xs">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">
          {user?.role === "admin" ? "All Issues" : "My Issues"}
        </Text>

        {user?.role !== "admin" && (
          <TouchableOpacity
            className="bg-black px-4 py-2 rounded-lg"
            onPress={() => router.push("/create")}
          >
            <Text className="text-white font-semibold">
              + New
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {issues.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">
            No issues found
          </Text>
        </View>
      ) : (
        <FlatList<Issue>
          data={issues}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="bg-white p-4 mb-3 rounded-xl">
              <Text className="font-semibold text-base">{item.title}</Text>
              <Text className="text-gray-600 mt-1">{item.description}</Text>
              <Text className="text-xs text-gray-400 mt-2">
                Status: {item.status}
              </Text>
            </View>
          )}
        />

      )}
    </View>
  );
}
