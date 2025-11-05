import React from "react";
import { Text, View } from "react-native";

export default function Employees() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Directory 📋</Text>
      <Text style={styles.text}>
        Browse, edit, or deactivate employee profiles. In future versions,
        you’ll also be able to generate reports or assign roles directly from
        here.
      </Text>
    </View>
  );
}

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  title: { color: "#00A36C", fontSize: 22, marginBottom: 8 },
  text: { color: "#aaa", textAlign: "center", fontSize: 14, lineHeight: 22 },
});
