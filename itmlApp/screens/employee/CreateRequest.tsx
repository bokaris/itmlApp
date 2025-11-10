import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatDate";

const API_URL = "http://10.0.2.2:5000";

export default function CreateRequest() {
  const { user } = useAuth();
  const [type, setType] = useState("remote");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRemaining = async () => {
      try {
        if (!user?.email) return;
        const res = await fetch(`${API_URL}/requests?email=${user.email}`);
        const data = await res.json();
        if (data.remaining) {
          setRemaining(data.remaining.remaining);
          setTotal(data.remaining.total);
        }
      } catch (err) {
        console.error("❌ Error fetching remaining:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRemaining();
  }, [user]);

  const handleSubmit = async () => {
    if (!user?.email) {
      Alert.alert("⚠️ Not logged in", "Please log in to submit a request.");
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert("⚠️ Missing info", "Please select both dates.");
      return;
    }

    if (endDate < startDate) {
      Alert.alert(
        "⚠️ Invalid dates",
        "End date cannot be earlier than start date."
      );
      return;
    }

    try {
      const res = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          startDate: startDate,
          endDate: endDate,
          email: user.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("✅ Success", "Request submitted successfully!");
        setStartDate(null);
        setEndDate(null);
      } else {
        console.error("❌ Server error:", data);
        Alert.alert("❌ Error", data.error || "Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Error", "Could not connect to server.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00A36C" />
      </View>
    );
  }

  const isAnnualDisabled = remaining === 0;

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>
          🗓 Remaining Annual Leaves:{" "}
          <Text
            style={{
              color: remaining === 0 ? "#E53935" : "#00A36C",
              fontWeight: "bold",
            }}
          >
            {remaining}/{total ?? 20}
          </Text>
        </Text>
      </View>

      <Text style={styles.label}>Request Type</Text>
      <View
        style={[styles.pickerWrapper, isAnnualDisabled && { opacity: 0.6 }]}
      >
        <Picker
          selectedValue={type}
          onValueChange={(val) => setType(val)}
          dropdownIconColor="#00A36C"
          style={{ color: "#fff" }}
        >
          <Picker.Item label="Remote Work" value="remote" />
          <Picker.Item
            label={
              isAnnualDisabled
                ? "Annual Leave (No remaining days)"
                : "Annual Leave"
            }
            value="annual"
            enabled={!isAnnualDisabled}
          />
        </Picker>
      </View>

      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={styles.inputText}>
          {startDate ? `📅 ${formatDate(startDate)}` : "Select Start Date"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>End Date</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => {
          if (!startDate) {
            Alert.alert("⚠️ Select start date first");
            return;
          }
          setShowEndPicker(true);
        }}
      >
        <Text style={styles.inputText}>
          {endDate ? `📅 ${formatDate(endDate)}` : "Select End Date"}
        </Text>
      </TouchableOpacity>

      {/* Date pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) {
              setStartDate(date);
              if (endDate && date > endDate) setEndDate(null);
            }
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || startDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={startDate || new Date()}
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <TouchableOpacity
        style={[
          styles.button,
          isAnnualDisabled && type === "annual" && { opacity: 0.5 },
        ]}
        onPress={handleSubmit}
        disabled={isAnnualDisabled && type === "annual"}
      >
        <Text style={styles.buttonText}>
          {isAnnualDisabled && type === "annual"
            ? "No Remaining Annual Leave"
            : "Submit Request"}
        </Text>
      </TouchableOpacity>
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
  header: {
    color: "#00A36C",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "#111",
    borderColor: "#00A36C55",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  summaryText: {
    color: "#ccc",
    textAlign: "center",
    fontSize: 15,
  },
  label: { color: "#aaa", marginBottom: 6 },
  pickerWrapper: {
    borderColor: "#00A36C",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#111",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#111",
    borderColor: "#00A36C",
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  inputText: { color: "#fff", fontSize: 15 },
  button: {
    backgroundColor: "#00A36C",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#00A36C",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
