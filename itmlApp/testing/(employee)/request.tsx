import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RequestForm() {
  const [type, setType] = useState("annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    const request = {
      type,
      startDate,
      endDate,
      reason,
      status: "pending",
    };
    console.log("Dummy request submitted:", request);
    alert("✅ Dummy request created! Check console log.");
    // later: send to backend via API
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Νέο Αίτημα</Text>

      <Text style={styles.label}>Τύπος Αιτήματος</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={type}
          style={styles.picker}
          dropdownIconColor="#00A36C"
          onValueChange={(value) => setType(value)}
        >
          <Picker.Item label="Annual Leave" value="annual" />
          <Picker.Item label="Remote" value="remote" />
          <Picker.Item label="Sick Leave" value="sick" />
        </Picker>
      </View>

      <Text style={styles.label}>Ημερομηνία Έναρξης</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#666"
        value={startDate}
        onChangeText={setStartDate}
      />

      {type !== "remote" && (
        <>
          <Text style={styles.label}>Ημερομηνία Λήξης</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#666"
            value={endDate}
            onChangeText={setEndDate}
          />
        </>
      )}

      <Text style={styles.label}>Λόγος</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        placeholder="Explain why..."
        placeholderTextColor="#666"
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Υποβολή Αιτήματος</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: {
    color: "#00A36C",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: { color: "#fff", marginBottom: 5, marginTop: 15 },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#00A36C",
  },
  pickerWrapper: {
    backgroundColor: "#111",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#00A36C",
  },
  picker: { color: "#fff" },
  button: {
    marginTop: 30,
    backgroundColor: "#00A36C",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#000", fontSize: 16, fontWeight: "bold" },
});
