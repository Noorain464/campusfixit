import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { 
  ActivityIndicator, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  Alert,
  TextInput
} from "react-native";
import { authApi, issueApi } from "../../utils/api";

export type Issue = {
  _id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved";
  category: "Electrical" | "Water" | "Internet" | "Infrastructure";
  remarks?: string;
  createdAt: string;
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
  
  // Filtering State
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  // Admin Update State
  const [adminRemark, setAdminRemark] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await authApi.getCurrentUser();
      const currentUser = res.user || res;
      setUser(currentUser);

      let issuesRes;
      if (currentUser?.role === "admin") {
        issuesRes = await issueApi.getAllIssues();
      } else {
        issuesRes = await issueApi.getMyIssues();
      }
      setIssues(Array.isArray(issuesRes) ? issuesRes : issuesRes.issues || []);
    } catch (err) {
      console.error("Load Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await issueApi.updateStatus(id, { 
        status: newStatus, 
        remarks: adminRemark || "Status updated by admin" 
      });
      Alert.alert("Success", `Issue marked as ${newStatus}`);
      setAdminRemark("");
      loadData(); // Refresh the list
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const filteredIssues = issues.filter(issue => {
    const catMatch = selectedCat === "All" || issue.category === selectedCat;
    const statusMatch = selectedStatus === "All" || issue.status === selectedStatus;
    return catMatch && statusMatch;
  });

  const renderStatusBadge = (status: string) => {
    let color = "bg-gray-400";
    if (status === "Open") color = "bg-red-500";
    if (status === "In Progress") color = "bg-yellow-500";
    if (status === "Resolved") color = "bg-green-500";

    return (
      <View className={`px-2 py-1 rounded-full ${color}`}>
        <Text className="text-white text-xs font-bold">{status}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-gray-800">
          {user?.role === "admin" ? "Campus Overview" : "My Reports"}
        </Text>
        {user?.role !== "admin" && (
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-lg"
            onPress={() => router.push("/create")}
          >
            <Text className="text-white font-semibold">+ Report</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Section */}
      <View className="mb-4">
        <Text className="text-xs font-bold text-gray-400 uppercase mb-2">Filter Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-3">
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setSelectedCat(cat)}
              className={`px-4 py-1.5 rounded-full mr-2 border ${selectedCat === cat ? 'bg-black border-black' : 'bg-white border-gray-300'}`}
            >
              <Text className={selectedCat === cat ? 'text-white' : 'text-gray-600'}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text className="text-xs font-bold text-gray-400 uppercase mb-2">Filter Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {statuses.map(status => (
            <TouchableOpacity 
              key={status} 
              onPress={() => setSelectedStatus(status)}
              className={`px-4 py-1.5 rounded-full mr-2 border ${selectedStatus === status ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
            >
              <Text className={selectedStatus === status ? 'text-white' : 'text-gray-600'}>{status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Issues List */}
      <FlatList
        data={filteredIssues}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text className="text-center text-gray-400 mt-10">No issues matching filters</Text>}
        renderItem={({ item }) => (
          <View className="bg-white p-4 mb-4 rounded-2xl shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="font-bold text-lg text-gray-800">{item.title}</Text>
                <Text className="text-blue-500 text-xs font-medium mb-2">{item.category}</Text>
              </View>
              {renderStatusBadge(item.status)}
            </View>
            
            <Text className="text-gray-600 leading-5">{item.description}</Text>
            
            {item.remarks && (
              <View className="mt-3 p-2 bg-blue-50 rounded-lg">
                <Text className="text-blue-800 text-xs italic">Admin Remark: {item.remarks}</Text>
              </View>
            )}

            <Text className="text-gray-400 text-[10px] mt-3">
              Reported on: {new Date(item.createdAt).toLocaleDateString()}
            </Text>

            {/* Admin Controls */}
            {user?.role === "admin" && item.status !== "Resolved" && (
              <View className="mt-4 pt-4 border-t border-gray-100">
                <TextInput
                  placeholder="Add a remark before updating status..."
                  className="bg-gray-100 p-2 rounded-lg text-xs mb-3"
                  onChangeText={setAdminRemark}
                />
                <View className="flex-row">
                  <TouchableOpacity 
                    onPress={() => handleUpdateStatus(item._id, "In Progress")}
                    className="bg-yellow-500 px-4 py-2 rounded-lg mr-2"
                  >
                    <Text className="text-white text-xs font-bold">In Progress</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleUpdateStatus(item._id, "Resolved")}
                    className="bg-green-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white text-xs font-bold">Mark Resolved</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}