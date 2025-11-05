import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { dummyUsers } from "../../constants/dummyUsers";

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = (user: any) => {
    if (user.role === "employee") {
      router.replace("/(employee)");
    } else if (user.role === "manager") {
      router.replace("/(manager)");
    } else if (user.role === "hr") {
      router.replace("/(hr)");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ITML HR App</Text>
      <Text style={styles.subtitle}>Choose a dummy user to login:</Text>

      {dummyUsers.map((user) => (
        <View key={user.id} style={{ marginVertical: 5 }}>
          <Button
            title={`${user.name} (${user.role})`}
            onPress={() => handleLogin(user)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  title: {
    color: "#00A36C",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: { color: "#fff", marginBottom: 15 },
});
