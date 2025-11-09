import React, { useEffect, useState } from "react";
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

        // ✅ Filter only approved annual leaves
        const approvedAnnuals = data.filter(
          (req: any) => req.type === "annual" && req.status === "approved"
        );

        // 🗓️ Mark days on calendar
        const marks: any = {};
        approvedAnnuals.forEach((req: any) => {
          const start = new Date(req.startDate);
          const end = new Date(req.endDate);
          let day = new Date(start);

          while (day <= end) {
            const dateStr = CalendarUtils.getCalendarDateString(day);
            marks[dateStr] = {
              marked: true,
              dotColor: "#00A36C",
            };
            day.setDate(day.getDate() + 1);
          }
        });

        setRequests(approvedAnnuals);
        setMarkedDates(marks);
      } catch (err) {
        console.error("❌ Error loading approved leaves:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedLeaves();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDayPress = (day: any) => {
    const date = day.dateString;
    setSelectedDate(date);

    const filtered = requests.filter((req) => {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const current = new Date(date);
      return current >= start && current <= end;
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
        Welcome, <Text style={styles.highlight}>{user?.name || "HR"}</Text> 👋
      </Text>
      <Text style={styles.header}>📅 Company Annual Leave Calendar</Text>

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
            selectedDayBackgroundColor: "#00A36C",
            selectedDayTextColor: "#000",
          }}
          markedDates={markedDates}
          markingType="dot"
          onDayPress={handleDayPress}
        />
      </View>

      {/* Modal for day details */}
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
              {dayRequests.length > 0 ? (
                dayRequests.map((req) => (
                  <View key={req._id} style={styles.leaveCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.leaveName}>
                        {req.employee?.name || "Unknown Employee"}
                      </Text>
                      <Text style={styles.leaveTeam}>
                        {req.employee?.role === "employee"
                          ? "Employee"
                          : req.employee?.role === "manager"
                          ? "Manager"
                          : "HR"}
                      </Text>
                    </View>
                    <Text style={styles.leaveDates}>
                      {formatDate(req.startDate)} → {formatDate(req.endDate)}
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
    marginBottom: 8,
  },
  highlight: { color: "#00A36C", fontWeight: "600" },
  header: {
    color: "#00A36C",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  calendarWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00A36C44",
    overflow: "hidden",
    backgroundColor: "#0C0C0C",
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 20,
    width: "85%",
    borderWidth: 1,
    borderColor: "#00A36C55",
    shadowColor: "#00A36C",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    color: "#00A36C",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
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
    marginBottom: 4,
  },
  leaveName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  leaveTeam: { color: "#00A36C", fontSize: 13, fontWeight: "500" },
  leaveDates: { color: "#aaa", fontSize: 13, marginTop: 4 },
  noLeaves: { color: "#888", textAlign: "center", marginTop: 20, fontSize: 14 },
  closeBtn: {
    backgroundColor: "#00A36C",
    borderRadius: 10,
    marginTop: 16,
    paddingVertical: 12,
    shadowColor: "#00A36C",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  closeText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
