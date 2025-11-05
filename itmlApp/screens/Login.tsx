import React, { useEffect, useState } from "react";
import { Button, Text, View, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://10.0.2.2:5000";

export default function Login() {
  const { setUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#00A36C" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <Text style={{ color: "#00A36C", fontSize: 24, marginBottom: 16 }}>
        ITML HR App
      </Text>
      <Text style={{ color: "#fff", marginBottom: 12 }}>Select a user:</Text>

      {users.map((u) => (
        <View key={u._id} style={{ marginVertical: 5, width: 200 }}>
          <Button
            title={`${u.name} (${u.role})`}
            onPress={() => setUser(u)}
            color="#00A36C"
          />
        </View>
      ))}
    </View>
  );
}
