import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import React from "react";
import { Button, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import ManagerApprovals from "./Approvals";
import Home from "./Home";
import Team from "./Team";

const Tab = createBottomTabNavigator();

export default function ManagerTabs() {
  const { setUser } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#00A36C",
        tabBarInactiveTintColor: "#888",
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#00A36C",
        headerTitleAlign: "center",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Approvals"
        component={ManagerApprovals}
        options={{
          title: "Approvals",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen name="Team" component={Team} />
      <Tab.Screen name="Logout" options={{ title: "Logout" }}>
        {() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
            }}
          >
            <Text style={{ color: "#fff", marginBottom: 16 }}>
              Are you sure?
            </Text>
            <Button title="Logout" onPress={() => setUser(null)} />
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
