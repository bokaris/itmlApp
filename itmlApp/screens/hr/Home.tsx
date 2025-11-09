import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";
import { useAuth } from "@/context/AuthContext";

const API_URL = "http://10.0.2.2:5000";

export default function HRHome() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [dayRequests, setDayRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchApprovedLeaves = async () => {
      try {
        const res = await fetch(`${API_URL}/requests`);
        const data = await res.json();

        // ✅ Only approved annual leaves
        const approvedAnnuals = data.filter(
          (r: any) => r.type === "annual" && r.status === "approved"
        );

        const marks: any = {};
        approvedAnnuals.forEach((r: any) => {
          const start = new Date(r.startDate);
          const end = new Date(r.endDate);
          let d = new Date(start);
          while (d <= end) {
            const dateStr = CalendarUtils.getCalendarDateString(d);
            marks[dateStr] = { marked: true, dotColor: "#00A36C" };
            d.setDate(d.getDate() + 1);
          }
        });

        setRequests(approvedAnnuals);
        setMarkedDates(marks);
      } catch (err) {
        console.error("❌ Error loading leaves:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedLeaves();
  }, []);

  // ✅ HR overview metrics
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const thisMonth = requests.filter(
      (r) => new Date(r.startDate).getMonth() === currentMonth
    ).length;

    const activeToday = requests.filter((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      return now >= start && now <= end;
    }).length;

    return { thisMonth, activeToday, total: requests.length };
  }, [requests]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const handleDayPress = (day: any) => {
    const date = day.dateString;
    setSelectedDate(date);

    const filtered = requests.filter((r) => {
      const s = new Date(r.startDate);
      const e = new Date(r.endDate);
      const c = new Date(date);
      return c >= s && c <= e;
    });

    setDayRequests(filtered);
    setVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00A36C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        HR Overview —{" "}
        <Text style={styles.highlight}>{user?.name || "Admin"}</Text>
      </Text>

      {/* 🔹 Summary cards */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Approved</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.thisMonth}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.activeToday}</Text>
          <Text style={styles.statLabel}>Active Today</Text>
        </View>
      </View>

      <Text style={styles.header}>📅 Company Leave Calendar</Text>

      <View style={styles.calendarWrapper}>
        <Calendar
          theme={{
            backgroundColor: "#000",
            calendarBackground: "#000",
            dayTextColor: "#fff",
            monthTextColor: "#00A36C",
            arrowColor: "#00A36C",
            textDisabledColor: "#444",
            todayTextColor: "#FFD700",
          }}
          markedDates={markedDates}
          markingType="dot"
          onDayPress={handleDayPress}
        />
      </View>

      {/* Modal for details */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedDate
                ? `Approved Leaves on ${formatDate(selectedDate)}`
                : "No date selected"}
            </Text>

            <ScrollView style={styles.scroll}>
              {dayRequests.length ? (
                dayRequests.map((r) => (
                  <View key={r._id} style={styles.leaveCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.leaveName}>
                        {r.employee?.name || "Unknown"}
                      </Text>
                      <Text style={styles.roleTag}>
                        {r.employee?.role || "EMPLOYEE"}
                      </Text>
                    </View>
                    <Text style={styles.leaveDates}>
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noLeaves}>
                  No approved leaves on this day
                </Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  welcome: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  highlight: { color: "#00A36C", fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  statBox: {
    backgroundColor: "#111",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00A36C55",
    width: "31%",
    paddingVertical: 10,
    alignItems: "center",
  },
  statNumber: { color: "#00A36C", fontSize: 20, fontWeight: "bold" },
  statLabel: { color: "#aaa", fontSize: 12, marginTop: 2 },
  header: {
    color: "#00A36C",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  calendarWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00A36C44",
    backgroundColor: "#0C0C0C",
    marginBottom: 16,
    overflow: "hidden",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 20,
    width: "85%",
    borderColor: "#00A36C55",
    borderWidth: 1,
  },
  modalTitle: {
    color: "#00A36C",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  scroll: { maxHeight: 260 },
  leaveCard: {
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#00A36C33",
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaveName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  roleTag: {
    color: "#00A36C",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  leaveDates: { color: "#aaa", fontSize: 13, marginTop: 4 },
  noLeaves: { color: "#888", textAlign: "center", marginTop: 20, fontSize: 14 },
  closeBtn: {
    backgroundColor: "#00A36C",
    borderRadius: 10,
    marginTop: 16,
    paddingVertical: 12,
  },
  closeText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
