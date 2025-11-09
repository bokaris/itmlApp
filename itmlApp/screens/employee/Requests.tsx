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
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/utils/formatDate";

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
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(20);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `http://10.0.2.2:5000/requests?email=${user?.email}`
      );
      const data = await res.json();

      const allRequests = Array.isArray(data) ? data : data.requests || [];

      const pendingRequests = allRequests.filter(
        (r: Request) => r.status === "pending"
      );

      setRequests(pendingRequests);
      setRemaining(data.remaining?.remaining ?? 0);
      setTotal(data.remaining?.total ?? 20);
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

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.type}>{item.type.toUpperCase()}</Text>
          <StatusBadge status={item.status} />
        </View>

        <Text style={styles.dates}>
          🗓 {formatDate(item.startDate)} → {formatDate(item.endDate)}
        </Text>

        {isAnnual && (
          <Text style={styles.subtext}>
            Manager:{" "}
            <Text
              style={{
                color:
                  item.managerApproved === null
                    ? "#FFD700"
                    : item.managerApproved
                    ? "#4CAF50"
                    : "#E53935",
              }}
            >
              {item.managerApproved === null
                ? "Pending"
                : item.managerApproved
                ? "Approved"
                : "Rejected"}
            </Text>
          </Text>
        )}

        <Text style={styles.subtext}>
          HR:{" "}
          <Text
            style={{
              color:
                item.hrApproved === null
                  ? "#FFD700"
                  : item.hrApproved
                  ? "#4CAF50"
                  : "#E53935",
            }}
          >
            {item.hrApproved === null
              ? "Pending"
              : item.hrApproved
              ? "Approved"
              : "Rejected"}
          </Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Pending Requests</Text>
          <Text style={styles.headerSubtitle}>
            Remaining annual leaves: {remaining}/{total}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate("CreateRequest")}
        >
          <Text style={styles.newButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {requests.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No pending requests 🎉</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
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
    marginVertical: 12,
  },
  headerTitle: {
    color: "#00A36C",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  newButton: {
    backgroundColor: "#00A36C",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: "#00A36C",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  newButtonText: { color: "#000", fontWeight: "bold", fontSize: 15 },
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderColor: "#00A36C55",
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  type: { color: "#00A36C", fontSize: 18, fontWeight: "bold" },
  dates: { color: "#ccc", marginBottom: 6 },
  subtext: { color: "#aaa", marginTop: 4, fontSize: 13 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: { color: "#777", fontSize: 16 },
});
