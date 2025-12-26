import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { issueApi } from "../../utils/api";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

const categories = [
  "Electrical",
  "Water",
  "Internet",
  "Infrastructure",
];

export default function CreateIssueScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !category) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);

      if (image) {
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;
        // @ts-ignore
        formData.append("image", { uri: image, name: filename, type });
      }
      await issueApi.createIssue(formData);

      Alert.alert("Success", "Issue created successfully");

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Raise an Issue</Text>

      {/* Title */}
      <TextInput
        placeholder="Issue Title"
        value={title}
        onChangeText={setTitle}
        className="bg-white p-4 rounded-xl mb-3"
      />

      {/* Description */}
      <TextInput
        placeholder="Issue Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        className="bg-white p-4 rounded-xl mb-3 h-28 text-start"
      />

      {/* Category */}
      <Text className="font-semibold mb-2">Category</Text>
      <View className="flex-row flex-wrap mb-4">
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            className={`px-4 py-2 mr-2 mb-2 rounded-full ${category === cat
                ? "bg-blue-600"
                : "bg-white border border-gray-300"
              }`}
          >
            <Text
              className={`${category === cat ? "text-white" : "text-gray-700"
                }`}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={pickImage} className="bg-gray-200 p-4 rounded-xl mb-4 border-dashed border-2 border-gray-400">
        <Text className="text-center text-gray-600">{image ? "Image Selected ✅" : "📷 Add Photo (Optional)"}</Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-blue-600 p-4 rounded-xl mt-4"
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Submitting..." : "Submit Issue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
