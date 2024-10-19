import { FC, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { post } from "../Utils/networkreq";
import { Toast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
type ModalProps = {
  closeModal: () => void;
};

const ModalComp: FC<ModalProps> = ({ closeModal }) => {
  const [text, onChangeText] = useState<string>("");
  const navigation = useNavigation();
  const isTextValid = text.length >= 3;

  const handlePlayPress = async () => {
    try {
      await post("/createUser", { userName: text });
      Toast.show(`Hello ${text}`, {
        type: "success",
        placement: "bottom",
        duration: 2000,
        animationType: "zoom-in",
      });
      await AsyncStorage.setItem("userName", text);
      navigation.navigate("Quizzes");
    } catch (error: any) {
      Toast.show(error.response?.data?.message || "Error creating user", {
        type: "danger",
        placement: "bottom",
        duration: 4000,
        animationType: "zoom-in",
      });
    }
  };

  return (
    <View style={styles.modalView}>
      <Text style={styles.modalText}>Please enter a username</Text>

      {/* TextInput with proper styling */}
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Username"
        placeholderTextColor="#6949FD"
      />

      {/* Buttons */}
      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.playButton, !isTextValid && { opacity: 0.5 }]}
          disabled={!isTextValid}
          onPress={handlePlayPress}
        >
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.exitButton} onPress={closeModal}>
          <Text style={styles.buttonText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    width: 320,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#6949FD",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#6949FD",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#6949FD",
    marginBottom: 20,
    backgroundColor: "#F3F3F3",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  playButton: {
    backgroundColor: "#6949FD",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginRight: 10,
    flex: 1,
  },
  exitButton: {
    backgroundColor: "#FFF",
    borderColor: "#6949FD",
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    color: "#32167c",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ModalComp;
