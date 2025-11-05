import React from "react";
import { Button, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { setUser } = useAuth();

  const dummyUsers = [
    { id: 1, name: "Alex", role: "employee" },
    { id: 2, name: "Maria", role: "manager" },
    { id: 3, name: "John", role: "hr" },
  ];

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
      <Text style={{ color: "#fff", marginBottom: 12 }}>
        Select a dummy user:
      </Text>
      {dummyUsers.map((u) => (
        <View key={u.id} style={{ marginVertical: 5 }}>
          <Button title={`${u.name} (${u.role})`} onPress={() => setUser(u)} />
        </View>
      ))}
    </View>
  );
}
