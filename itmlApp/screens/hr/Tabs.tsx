import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";

import HRApprovals from "./HRApprovals";
import Home from "./Home";
import Settings from "./Settings";
import LogoutModal from "@/components/LogoutModal";

const Tab = createBottomTabNavigator();

export default function HrTabs() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#000", borderTopColor: "#111" },
          tabBarActiveTintColor: "#00A36C",
          tabBarInactiveTintColor: "#888",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#00A36C",
          headerTitleAlign: "center",
          tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Approvals"
          component={HRApprovals}
          options={{
            title: "Approvals",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="checkmark-done-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Reports"
          component={Settings}
          options={{
            title: "Reports",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Logout"
          options={{
            title: "Logout",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="exit-outline" size={size} color={color} />
            ),
          }}
        >
          {() => (
            <View style={styles.logoutScreen}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setShowLogoutModal(true)}
              >
                <Text style={styles.logoutButtonText}>Tap to Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </Tab.Screen>
      </Tab.Navigator>

      {/* 🧩 Logout confirmation modal */}
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  logoutScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  logoutButton: {
    backgroundColor: "#00A36C",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
