import { usePathname } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import LogoutButton from "../../components/LogoutButton";
import { useAuth } from "../../context/AuthContext";

export default function HRDashboard() {
  console.log("🔹 Active route:", usePathname(), "User:", useAuth());

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 HR Dashboard</Text>
      <Text style={styles.subtitle}>
        Εδώ βλέπεις όλα τα αιτήματα (annual + remote)
      </Text>
      <Text style={styles.subtitle}>+ κατάσταση approvals</Text>
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
