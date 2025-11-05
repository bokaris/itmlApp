import { Redirect, Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

function Gate() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    console.log("Current path:", pathname, "User:", user);

    setTimeout(() => setReady(true), 50);
  }, []);

  if (!ready) return null;

  const isProtected =
    pathname.startsWith("/(employee)") ||
    pathname.startsWith("/(manager)") ||
    pathname.startsWith("/(hr)");

  if (!user && isProtected) return <Redirect href="/login" />;

  // Authenticated but at /login → redirect to role area
  if (user && pathname === "/login") {
    if (user.role === "employee") return <Redirect href="/(employee)" />;
    if (user.role === "manager") return <Redirect href="/(manager)" />;
    if (user.role === "hr") return <Redirect href="/(hr)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "ITML App",
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#00A36C",
        headerBackVisible: true,
        headerTitleAlign: "center",
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
