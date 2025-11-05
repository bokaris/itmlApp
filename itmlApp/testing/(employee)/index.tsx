import { StyleSheet, Text, View } from "react-native";
import LogoutButton from "../../components/LogoutButton";

export default function EmployeeHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Καλώς ήρθες, Γιάννη 👋</Text>
      <Text style={styles.subtitle}>
        Διάλεξε τι θες να κάνεις από τα tabs κάτω 👇
      </Text>
      <LogoutButton />
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: { color: "#fff", fontSize: 16 },
});
