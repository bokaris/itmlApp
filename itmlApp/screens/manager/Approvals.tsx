import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { dummyRequests } from "../../constants/dummyRequests";

export default function ManagerApprovals() {
  // Manager βλέπει μόνο annual requests που είναι pending
  const managerPending = dummyRequests.filter(
    (r) => r.type === "annual" && r.status === "pending"
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Αιτήματα προς έγκριση</Text>
      <FlatList
        data={managerPending}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {item.employee} ζητά Annual Leave {item.startDate} -{" "}
              {item.endDate}
            </Text>
            <Text style={{ color: "#888" }}>Status: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#888" }}>Δεν υπάρχουν εκκρεμή αιτήματα</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: {
    color: "#00A36C",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardText: { color: "#fff", marginBottom: 4 },
});
