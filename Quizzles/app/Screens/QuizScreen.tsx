import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import QuestionModal from "../Components/QuestionModal";
import { AntDesign } from "@expo/vector-icons";
import { resp } from "../Utils/dummyResponse";
const QuizScreen = ({ route, navigation }) => {
  const { quizId } = route.params;
  const { quizID, questions } = resp;
  const quizQuestions = quizID === parseInt(quizId, 10) ? questions : [];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.push("Quizzes");
          }}
        >
          <AntDesign name="arrowleft" size={32} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Quiz {quizId}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <QuestionModal questions={quizQuestions} quizID={quizID} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1147",
    paddingTop: 50,
  },
  header: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#1f1147",
  },
  backButton: {
    backgroundColor: "#32167c",
    padding: 10,
    borderRadius: 50,
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#37e9bb",
  },
});

export default QuizScreen;
