import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const API_URL = "http://10.0.2.2:5000";

export default function Team() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        const data = await res.json();

        const employees = data.filter((u: any) => u.role === "employee");
        setTeam(employees);
      } catch (err) {
        console.error("❌ Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00A36C" />
      </View>
    );
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.roleTag}>
          <Text style={styles.roleText}>Employee</Text>
        </View>
      </View>

      <Text style={styles.email}>{item.email}</Text>

      <Text style={styles.leaves}>
        🌿 Remaining Leaves:{" "}
        <Text style={{ color: "#00A36C" }}>
          {item.remainingLeaves ?? item.annualLeaveAllowance ?? 20}
        </Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Team 👥</Text>
      <FlatList
        data={team}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    color: "#00A36C",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#00A36C33",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: { color: "#fff", fontSize: 16, fontWeight: "600" },
  roleTag: {
    backgroundColor: "#00A36C22",
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  roleText: { color: "#00A36C", fontSize: 12, fontWeight: "600" },
  email: { color: "#aaa", fontSize: 13, marginBottom: 6 },
  leaves: { color: "#ccc", fontSize: 13, marginBottom: 4 },
  subtext: { color: "#888", fontSize: 12 },
});
