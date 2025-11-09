import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

const API_URL = "http://10.0.2.2:5000";

export default function HRApprovals() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/requests`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
      Alert.alert("Error", "Could not load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    id: string,
    action: "hr-approve" | "hr-reject"
  ) => {
    try {
      const res = await fetch(`${API_URL}/requests/${id}/${action}`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("⚠️ Action failed", data.error || "Action not allowed");
        return;
      }

      Alert.alert("✅ Success", data.message);
      fetchRequests();
    } catch (err) {
      console.error(`❌ Error on ${action}:`, err);
      Alert.alert("Error", `Failed to ${action} request`);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00A36C" />
      </View>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const renderItem = ({ item }: any) => {
    const isAnnual = item.type === "annual";
    const isRemote = item.type === "remote";

    const canHrAct =
      item.status === "pending" &&
      (isRemote ||
        (isAnnual && (item.hrApproved === false || item.hrApproved === null)));

    const statusColor =
      item.status === "approved"
        ? "#4CAF50"
        : item.status === "rejected"
        ? "#E53935"
        : "#FFD700";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.employee}>
            {item.employee?.name || "Unknown"}
          </Text>
          <View style={[styles.badge, { backgroundColor: statusColor + "22" }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.type, { color: isAnnual ? "#00A36C" : "#0099FF" }]}
        >
          {item.type.toUpperCase()}
        </Text>

        <View style={styles.datesRow}>
          <Text style={styles.text}>🗓 {formatDate(item.startDate)}</Text>
          <Text style={styles.text}>→ {formatDate(item.endDate)}</Text>
        </View>

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

        {canHrAct ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => handleAction(item._id, "hr-approve")}
              style={[styles.btn, styles.btnApprove]}
            >
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAction(item._id, "hr-reject")}
              style={[styles.btn, styles.btnReject]}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noteText}>
            {isAnnual && item.managerApproved === null
              ? "Waiting for manager approval"
              : "Processed or completed"}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>HR Approvals</Text>
      <FlatList
        data={requests}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    color: "#00A36C",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 14,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderColor: "#00A36C55",
    borderWidth: 1,
    shadowColor: "#00A36C",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  employee: { color: "#fff", fontWeight: "600", fontSize: 16 },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  badgeText: { fontWeight: "bold", fontSize: 13 },
  type: { fontWeight: "600", marginBottom: 6, fontSize: 15 },
  datesRow: { flexDirection: "row", gap: 6 },
  text: { color: "#ccc", fontSize: 13 },
  subtext: { color: "#aaa", marginTop: 6, fontSize: 13 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  btn: {
    paddingVertical: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  btnApprove: { backgroundColor: "#00A36C" },
  btnReject: { backgroundColor: "#C62828" },
  btnText: { color: "#fff", fontWeight: "bold" },
  noteText: { color: "#888", marginTop: 10, fontSize: 13 },
});
