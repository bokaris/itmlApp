import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import Home from "./Home";
import Requests from "./Requests";
import CreateRequest from "./CreateRequest";
import History from "./History";
import LogoutModal from "@/components/LogoutModal";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RequestStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#00A36C",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Requests"
        component={Requests}
        options={{ title: "Requests" }}
      />
      <Stack.Screen
        name="CreateRequest"
        component={CreateRequest}
        options={{ title: "New Request" }}
      />
    </Stack.Navigator>
  );
}

export default function EmployeeTabs() {
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
            title: "Calendar",
            headerTitle: "📅 Team Annual Leave Calendar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="RequestsTab"
          component={RequestStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="document-text-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />

        <Tab.Screen
          name="History"
          component={History}
          options={{
            title: "History",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time-outline" color={color} size={size} />
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

      {/* Logout confirmation modal */}
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
