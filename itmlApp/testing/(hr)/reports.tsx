import { StyleSheet, Text, View } from "react-native";

export default function Reports() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📑 HR Reports</Text>
      <Text style={styles.subtitle}>Dummy data: export σε Excel/PDF</Text>
      <Text style={styles.subtitle}>+ στατιστικά για leave balances</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#00A36C",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: { color: "#fff", fontSize: 16 },
});
