import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00A36C" />
        <Text style={{ color: "#aaa", marginTop: 10 }}>Loading users...</Text>
      </View>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "manager":
        return "briefcase-outline";
      case "hr":
        return "people-circle-outline";
      default:
        return "person-outline";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "manager":
        return "#0099FF";
      case "hr":
        return "#FFB300";
      default:
        return "#00A36C";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ITML HR Demo App</Text>
      <Text style={styles.subtitle}>Select a demo user to log in</Text>

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={styles.userList}
      >
        {users.map((u) => (
          <TouchableOpacity
            key={u._id}
            style={[styles.userCard, { borderColor: getRoleColor(u.role) }]}
            onPress={() => setUser(u)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={getRoleIcon(u.role) as any}
              size={26}
              color={getRoleColor(u.role)}
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{u.name}</Text>
              <Text style={[styles.userRole, { color: getRoleColor(u.role) }]}>
                {u.role.toUpperCase()}
              </Text>
            </View>
            <Ionicons name="log-in-outline" size={20} color="#aaa" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.footerText}>v1.0.0 — ITML HR System Demo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: "center",
  },
  loader: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#00A36C",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#aaa",
    marginBottom: 20,
  },
  userList: {
    alignItems: "center",
    paddingBottom: 60,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "#111",
    marginBottom: 10,
    width: "95%",
  },
  userName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  userRole: { fontSize: 13, marginTop: 2, textTransform: "capitalize" },
  footerText: {
    color: "#555",
    fontSize: 12,
    position: "absolute",
    bottom: 20,
  },
});
