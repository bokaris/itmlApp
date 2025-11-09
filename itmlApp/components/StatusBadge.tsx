import React from "react";
import { Text, View, StyleSheet } from "react-native";

type Props = {
  status: "approved" | "pending" | "rejected";
};

export default function StatusBadge({ status }: Props) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    approved: { bg: "#1B5E20", text: "#A5D6A7" },
    pending: { bg: "#F57F17", text: "#FFF9C4" },
    rejected: { bg: "#B71C1C", text: "#FFCDD2" },
  };

  const { bg, text } = colorMap[status] || colorMap.pending;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{status.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
