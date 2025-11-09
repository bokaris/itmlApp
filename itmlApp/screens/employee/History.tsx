import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/utils/formatDate";

const API_URL = "http://10.0.2.2:5000";

interface RequestItem {
  _id?: string | number;
  type?: string;
  status: "approved" | "pending" | "rejected";
  startDate?: string;
  endDate?: string;
  managerApproved?: boolean | null;
  hrApproved?: boolean | null;
  [key: string]: any;
}

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!user?.email) return;

        const res = await fetch(`${API_URL}/requests?email=${user.email}`);
        const data = await res.json();

        const allRequests: RequestItem[] = Array.isArray(data)
          ? (data as RequestItem[])
          : (data.requests as RequestItem[]) || [];

        const filtered = allRequests.filter(
          (r) => r.status === "approved" || r.status === "rejected"
        );

        setHistory(filtered);
      } catch (err) {
        console.error("❌ Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00A36C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Request History 🗂️</Text>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color="#444" />
          <Text style={styles.emptyText}>No past requests yet</Text>
        </View>
      ) : (
        <FlatList<RequestItem>
          data={history}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const isAnnual = item.type === "annual";

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.type}>{item.type?.toUpperCase()}</Text>
                  <StatusBadge status={item.status} />
                </View>

                <Text style={styles.dates}>
                  {formatDate(item.startDate)} → {formatDate(item.endDate)}
                </Text>

                {isAnnual && (
                  <Text style={styles.approvals}>
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
                    {"   "} | HR:{" "}
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
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  title: {
    color: "#00A36C",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 14,
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: { color: "#777", marginTop: 10, fontSize: 15 },
  card: {
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#00A36C55",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: { color: "#00A36C", fontWeight: "bold", fontSize: 16 },
  dates: { color: "#aaa", marginTop: 6 },
  approvals: { color: "#ccc", marginTop: 6, fontSize: 13 },
});
