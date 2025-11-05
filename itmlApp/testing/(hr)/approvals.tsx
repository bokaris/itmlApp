import { FlatList, StyleSheet, Text, View } from "react-native";
import { dummyRequests } from "../../constants/dummyRequests";

export default function HRApprovals() {
  // HR βλέπει remote pending + annual που έχουν manager_approved
  const hrPending = dummyRequests.filter(
    (r) =>
      (r.type === "remote" && r.status === "pending") ||
      (r.type === "annual" && r.status === "manager_approved")
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ HR Approvals</Text>
      <FlatList
        data={hrPending}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {item.employee} —{" "}
              {item.type === "annual" ? "Annual Leave" : "Remote"}
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
