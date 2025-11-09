import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/AuthContext";

const API_URL = "http://10.0.2.2:5000";

export default function CreateRequest() {
  const { user } = useAuth(); // ✅ get logged-in user
  const [type, setType] = useState("remote");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split("T")[0] : "";

  // 🧩 Fetch remaining annual leave on load
  useEffect(() => {
    const fetchRemaining = async () => {
      try {
        if (!user?.email) return;
        const res = await fetch(`${API_URL}/requests?email=${user.email}`);
        const data = await res.json();
        if (data.remaining) setRemaining(data.remaining.remaining);
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
      const res = await fetch("http://10.0.2.2:5000/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          email: user.email, // ✅ dynamic
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

  return (
    <View style={styles.container}>
      {/* Type Dropdown */}
      <Text style={styles.label}>Request Type</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={type}
          onValueChange={(val) => setType(val)}
          dropdownIconColor="#00A36C"
          style={{ color: "#fff" }}
        >
          <Picker.Item label="Remote Work" value="remote" />
          <Picker.Item
            label="Annual Leave"
            value="annual"
            enabled={remaining !== 0}
          />
        </Picker>
      </View>

      {/* Start Date */}
      <Text style={styles.label}>Start Date</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={styles.inputText}>
          {startDate ? `Start: ${formatDate(startDate)}` : "Select Start Date"}
        </Text>
      </TouchableOpacity>

      {/* End Date */}
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
          {endDate ? `End: ${formatDate(endDate)}` : "Select End Date"}
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
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
    marginBottom: 10,
  },
  inputText: { color: "#fff" },
  button: {
    backgroundColor: "#00A36C",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
