import { FlatList, StyleSheet, Text, View } from "react-native";
import { dummyRequests } from "../../constants/dummyRequests";

export default function History() {
  const employeeName = "John Doe"; // προσωρινά hardcoded

  const myRequests = dummyRequests.filter((r) => r.employee === employeeName);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Ιστορικό Αιτημάτων</Text>
      <FlatList
        data={myRequests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {item.type === "annual" ? "Annual Leave" : "Remote"} —{" "}
              {item.status}
            </Text>
          </View>
        )}
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
  cardText: { color: "#fff" },
});
