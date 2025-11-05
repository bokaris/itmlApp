import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

import History from "./History";
import Home from "./Home";
import Requests from "./Requests";
import CreateRequest from "./CreateRequest"; // 👈 new import

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
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="RequestsTab"
        component={RequestStack} // 👈 now uses the stack
        options={{
          title: "Requests",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
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
