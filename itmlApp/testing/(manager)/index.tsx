import { StyleSheet, Text, View } from "react-native";
import LogoutButton from "../../components/LogoutModal";

export default function ManagerDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍💼 Manager Dashboard</Text>
      <Text style={styles.subtitle}>
        Εδώ θα βλέπεις remote requests της ομάδας σου
      </Text>
      <Text style={styles.subtitle}>+ γενικό overview</Text>
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
