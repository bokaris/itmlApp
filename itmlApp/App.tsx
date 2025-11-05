// App.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./screens/Login";
import EmployeeTabs from "./screens/employee/Tabs";
import HrTabs from "./screens/hr/Tabs";
import ManagerTabs from "./screens/manager/Tabs";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#00A36C",
          headerTitleAlign: "center",
        }}
      >
        {!user ? (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: "Login" }}
          />
        ) : user.role === "employee" ? (
          <Stack.Screen
            name="EmployeeTabs"
            component={EmployeeTabs}
            options={{ headerShown: false }}
          />
        ) : user.role === "manager" ? (
          <Stack.Screen
            name="ManagerTabs"
            component={ManagerTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="HrTabs"
            component={HrTabs}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
