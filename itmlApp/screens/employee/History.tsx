import React from "react";
import { Text, View } from "react-native";

export default function History() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <Text style={{ color: "#00A36C", fontSize: 22 }}>My Request History</Text>
    </View>
  );
}
