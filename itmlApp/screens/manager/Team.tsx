import React from "react";
import { Text, View } from "react-native";

export default function Team() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Team 👥</Text>
      <Text style={styles.text}>
        View team members, their roles, and request summaries. Future updates
        may include performance metrics or communication tools.
      </Text>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: "#000",
    padding: 20,
  },
  title: { color: "#00A36C", fontSize: 22, marginBottom: 8 },
  text: {
    color: "#aaa",
    textAlign: "center" as "center",
    fontSize: 14,
    lineHeight: 22,
  },
};
