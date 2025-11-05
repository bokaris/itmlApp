import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <Text style={{ color: "#00A36C", fontSize: 22 }}>
        Welcome {user?.name} 👋
      </Text>
    </View>
  );
}
