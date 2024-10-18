import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { type FC, useState, useEffect } from "react";
import QuestionModal from "../Components/QuestionModal";
import { AntDesign } from "@expo/vector-icons";

import { get } from "../Utils/networkreq";
const QuizScreen = ({ route, navigation }) => {
  const { quizId } = route.params;
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await get(`/quizzes/${quizId}`);
        if (response?.status) {
          setQuizQuestions(response.questions);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [quizId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#37e9bb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <AntDesign name="warning" size={64} color="red" />
        <Text style={styles.errorText}>
          Error fetching quiz data. Please try again.
        </Text>
      </View>
    );
  }

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
        <QuestionModal questions={quizQuestions} quizID={quizId} />
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginTop: 10,
  },
});

export default QuizScreen;
