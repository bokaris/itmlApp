import React from "react";
import { Text, View } from "react-native";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HR Settings ⚙️</Text>
      <Text style={styles.text}>
        Configure app permissions, request policies, and workflow rules. In
        later updates, this section could include analytics and dashboard
        configurations.
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
    textAlign: "center" as const,
    fontSize: 14,
    lineHeight: 22,
  },
};
