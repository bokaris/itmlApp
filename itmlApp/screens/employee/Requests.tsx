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
import { useAuth } from "@/context/AuthContext";

type Request = {
  _id: string;
  type: string;
  status: "approved" | "pending" | "rejected";
  employee?: { name: string; email: string };
  startDate: string;
  endDate: string;
  managerApproved?: boolean | null;
  hrApproved?: boolean | null;
};

export default function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [remaining, setRemaining] = useState();
  const [total, setTotal] = useState();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `http://10.0.2.2:5000/requests?email=${user?.email}`
      );
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
        setRemaining(data.remaining?.remaining ?? 0);
        setTotal(data.remaining?.total ?? 20);
      } else {
        setRequests(data);
      }
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00A36C" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Request }) => {
    const isAnnual = item.type === "annual";
    const employeeName = item.employee?.name || "Unknown Employee";

    const statusStyle =
      item.status === "approved"
        ? styles.statusApproved
        : item.status === "rejected"
        ? styles.statusRejected
        : styles.statusPending;

    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    return (
      <View style={styles.card}>
        <Text style={styles.type}>{item.type.toUpperCase()}</Text>
        <Text style={styles.employee}>Employee: {employeeName}</Text>
        <Text style={styles.dates}>
          {formatDate(item.startDate)} → {formatDate(item.endDate)}
        </Text>

        {/* 🧩 Show approval stages */}
        {isAnnual && (
          <Text style={styles.subtext}>
            Manager Approval:{" "}
            <Text style={styles.managerStatus}>
              {item.managerApproved === null
                ? "Pending"
                : item.managerApproved
                ? "Approved ✅"
                : "Rejected ❌"}
            </Text>
          </Text>
        )}

        <Text style={styles.subtext}>
          HR Approval:{" "}
          <Text style={styles.managerStatus}>
            {item.hrApproved === null
              ? "Pending"
              : item.hrApproved
              ? "Approved ✅"
              : "Rejected ❌"}
          </Text>
        </Text>

        <Text style={[styles.status, statusStyle]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>
          Remaining annual leaves: {remaining}/{total}
        </Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate("CreateRequest")}
        >
          <Text style={styles.newButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBlock: 12,
  },
  header: { color: "#00A36C", fontSize: 18 },
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
  employee: { color: "#ccc", marginTop: 4 },
  dates: { color: "#aaa", marginTop: 4 },
  subtext: { color: "#aaa", marginTop: 6 },
  managerStatus: { color: "#FFD700" },
  status: {
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "right",
    fontSize: 15,
  },
  statusApproved: { color: "#4CAF50" },
  statusRejected: { color: "#E53935" },
  statusPending: { color: "#FFC107" },
});
