import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

type Request = {
  id: number;
  type: string;
  status: "approved" | "pending" | "rejected";
  employee: string;
  startDate: string;
  endDate: string;
};

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/requests?email=employee@itml.com"
      );
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Runs every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Remote / Leave Requests</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate("CreateRequest")}
        >
          <Text style={styles.newButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00A36C" />
      ) : (
        <FlatList
          data={requests}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.type}>{item.type.toUpperCase()}</Text>
              <Text style={styles.dates}>
                {item.startDate} → {item.endDate}
              </Text>
              <Text
                style={[
                  styles.status,
                  item.status === "approved"
                    ? styles.statusApproved
                    : item.status === "rejected"
                    ? styles.statusRejected
                    : styles.statusPending,
                ]}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  header: { color: "#00A36C", fontSize: 22 },
  newButton: {
    backgroundColor: "#00A36C",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  newButtonText: { color: "#000", fontWeight: "bold" },
  card: {
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderColor: "#00A36C",
    borderWidth: 1,
  },
  type: { color: "#00A36C", fontSize: 18, fontWeight: "bold" },
  dates: { color: "#aaa", marginTop: 5 },
  status: { marginTop: 10, fontWeight: "bold", textAlign: "right" },
  statusApproved: { color: "#4CAF50" },
  statusRejected: { color: "#E53935" },
  statusPending: { color: "#FFC107" },
});
