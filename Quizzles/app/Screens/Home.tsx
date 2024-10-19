import { type FC, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
} from "react-native";
import ModalComp from "../Components/Modal";
const image = require("../../assets/splash.png");
import { useNavigation } from "@react-navigation/native";
const Home: FC = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const navigation = useNavigation();
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [opacity, translateY]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={{ flex: 1 }}>
          <Animated.View
            style={[
              styles.textBox,
              {
                opacity: opacity,
                transform: [{ translateY: translateY }],
              },
            ]}
          >
            <Text style={styles.textHeading}>Let's Play!</Text>
            <Text style={styles.textSubHeading}>
              Play now and start learning
            </Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.buttonBox,
              {
                opacity: opacity,
                transform: [{ translateY: translateY }],
              },
            ]}
          >
            <TouchableOpacity style={styles.playNowButton} onPress={openModal}>
              <Text style={styles.playNowText}>Play Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.aboutButton}
              onPress={() => {
                navigation.navigate("Leaderboard");
              }}
            >
              <Text style={styles.aboutText}>Leaderboards</Text>
            </TouchableOpacity>
          </Animated.View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              <ModalComp closeModal={closeModal} />
            </View>
          </Modal>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
  },
  textBox: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "70%",
  },
  textHeading: {
    fontWeight: "700",
    fontSize: 36,
    color: "white",
  },
  textSubHeading: {
    fontWeight: "600",
    fontSize: 24,
    color: "white",
  },
  buttonBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playNowButton: {
    backgroundColor: "#6949FD",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
    width: "80%",
  },
  playNowText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  aboutButton: {
    borderWidth: 2,
    borderColor: "#6949FD",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "80%",
  },
  aboutText: {
    color: "#6949FD",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default Home;
