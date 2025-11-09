import React from "react";
import { Text, View, StyleSheet } from "react-native";

type Props = {
  status: "approved" | "pending" | "rejected";
};

export default function StatusBadge({ status }: Props) {
  const colorMap: Record<string, { text: string }> = {
    approved: { text: "#4CAF50" },
    pending: { text: "#FFD700" },
    rejected: { text: "#E53935" },
  };

  const { text } = colorMap[status] || colorMap.pending;

  return (
    <View style={[styles.badge, { backgroundColor: text + "22" }]}>
      <Text style={[styles.text, { color: text }]}>{status.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 13,
  },
});
