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

  const renderItem = ({ item }: any) => {
    const isAnnual = item.type === "annual";
    const isRemote = item.type === "remote";

    const canHrAct =
      item.status === "pending" &&
      (isRemote ||
        (isAnnual && (item.hrApproved === false || item.hrApproved === null)));

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
        <Text style={styles.employee}>
          Employee: {item.employee?.name || "Unknown"}
        </Text>
        <Text
          style={[styles.type, { color: isAnnual ? "#00A36C" : "#0099FF" }]}
        >
          Type: {item.type.toUpperCase()}
        </Text>
        <Text style={styles.text}>From: {formatDate(item.startDate)}</Text>
        <Text style={styles.text}>To: {formatDate(item.endDate)}</Text>

        {/* Manager approval only for annual requests */}
        {isAnnual && (
          <Text style={styles.text}>
            Manager Approval:{" "}
            <Text style={styles.statusYellow}>
              {item.managerApproved === null
                ? "Pending"
                : item.managerApproved
                ? "Approved ✅"
                : "Rejected ❌"}
            </Text>
          </Text>
        )}

        {/* HR approval visible for all */}
        <Text style={styles.text}>
          HR Approval:{" "}
          <Text style={styles.statusYellow}>
            {item.hrApproved === null
              ? "Pending"
              : item.hrApproved
              ? "Approved ✅"
              : "Rejected ❌"}
          </Text>
        </Text>

        <Text style={styles.text}>Status: {item.status.toUpperCase()}</Text>

        {canHrAct ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => handleAction(item._id, "hr-approve")}
              style={[styles.btn, styles.approveBtn]}
            >
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAction(item._id, "hr-reject")}
              style={[styles.btn, styles.rejectBtn]}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noteRow}>
            {isAnnual && item.managerApproved === null ? (
              <Text style={styles.noteText}>
                ⏳ Waiting for manager approval first
              </Text>
            ) : (
              <Text style={styles.noteText}>✅ Processed</Text>
            )}
          </View>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    color: "#00A36C",
    fontSize: 22,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: "#00A36C",
    borderWidth: 1,
  },
  employee: {
    color: "#fff",
    marginBottom: 2,
  },
  type: {
    marginBottom: 4,
    fontWeight: "600",
  },
  text: {
    color: "#fff",
    marginBottom: 2,
  },
  statusYellow: {
    color: "#FFD700",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btn: {
    padding: 8,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  approveBtn: {
    backgroundColor: "#00A36C",
  },
  rejectBtn: {
    backgroundColor: "#C62828",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noteRow: {
    marginTop: 6,
  },
  noteText: {
    color: "#999",
  },
});
