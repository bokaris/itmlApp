import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { useAuth } from "@/context/AuthContext";

type LogoutModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function LogoutModal({ visible, onClose }: LogoutModalProps) {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Logout</Text>
          <Text style={styles.text}>
            Are you sure you want to log out,{" "}
            <Text style={{ color: "#00A36C" }}>{user?.name || "User"}</Text>?
          </Text>

          <View style={styles.buttonsRow}>
            <Pressable style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.logoutBtn]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modal: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    borderWidth: 1,
    borderColor: "#00A36C55",
  },
  title: {
    color: "#00A36C",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: "#222",
    marginRight: 10,
  },
  logoutBtn: {
    backgroundColor: "#00A36C",
    marginLeft: 10,
  },
  cancelText: { color: "#aaa", fontWeight: "bold" },
  logoutText: { color: "#000", fontWeight: "bold" },
});
