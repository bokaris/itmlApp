import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Manage company leave policies, view usage reports, and configure
        approval workflows.
      </Text>

      <View style={styles.section}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="people-outline" size={26} color="#00A36C" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>Team Overview</Text>
            <Text style={styles.cardDesc}>
              View all employees and their remaining annual leaves.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="stats-chart-outline" size={26} color="#00A36C" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>Leave Reports</Text>
            <Text style={styles.cardDesc}>
              Generate leave summaries and visualize team availability.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="settings-outline" size={26} color="#00A36C" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>Policy Settings</Text>
            <Text style={styles.cardDesc}>
              Configure approval rules and annual leave allowances.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  section: {
    marginTop: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#00A36C55",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  cardDesc: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 2,
  },
});
